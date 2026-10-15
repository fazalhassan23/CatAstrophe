/* Pure fixed-step simulation. No rendering, timers, DOM, or audio. */
(function(root){
'use strict';
const C={W:450,H:720,floor:660,x:116,r:15,gravity:760,impulse:-285,maxFall:390,speed:145,spacing:345,gap:208};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function random(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const TYPES=['laundry','pigeon','vacuum','toast','fan','yarn'];
const ROSTER={biscuit:{name:'Biscuit',title:'THE CLASSIC MENACE',description:'Enthusiasm: unlimited. Flight experience: none.',trait:'Balanced flight. A reliable little menace.',gravity:1,flap:1,speed:1,cost:0},mochi:{name:'Mochi',title:'THE FLOOF',description:'More fluff than aerodynamics. Professionally unbothered.',trait:'18% lighter gravity, softer flaps, 7% slower flight.',gravity:.82,flap:.9,speed:.93,cost:20},pounce:{name:'Sir Pounce',title:'A VERY FANCY DISASTER',description:'Dressed for success. Prepared for absolutely nothing.',trait:'Sharper flaps, heavier fall. Precision Air Pounce ability.',gravity:1.08,flap:1.06,speed:1,cost:45}};
function rectDistance(x,y,r){return Math.hypot(x-clamp(x,r.x,r.x+r.w),y-clamp(y,r.y,r.y+r.h))}
class Run{
 constructor(seed=1,cat='biscuit'){this.seed=seed;this.rand=random(seed);this.rewardRand=random((seed^0x9e3779b9)>>>0);this.cat=ROSTER[cat]?cat:'biscuit';this.trait=ROSTER[this.cat];this.state='playing';this.time=0;this.distance=0;this.score=0;this.fish=0;this.passed=0;this.y=350;this.vy=0;this.flapAge=1;this.gates=[];this.items=[];this.events=[];this.next=220;this.center=350;this.id=0;this.death='';this.world=0;this.near=0;this.combo=0;this.bestCombo=0;this.comboTimer=0;this.slow=0;this.armor=0;this.tangle=0;this.taps=0;this.invuln=0;this.mood='curious';this.moodTime=0;this.stats={pass:0,fish:0,near:0,world:0};this.escapes=0;this.blocks=0;this.nip=0;this.magnet=0;this.dash=0;this.charge=0;this.cooldown=0;this.rescues=0;this.usedRescues=0;this.tokens=0;this.dashes=0;this.flaps=0;this.mischief=root.CatMischief?new root.CatMischief.System(this):null;}
 emit(type,data={}){this.events.push({type,...data})}
 drain(){const e=this.events;this.events=[];return e}
 flap(){if(this.state!=='playing')return;if(this.tangle>0){this.taps++;if(this.taps>=3)this.escape();return}this.flaps++;this.vy=C.impulse*this.trait.flap*(this.armor>0?.93:1);this.flapAge=0;this.emit('flap')}
 moodSet(m,t=1){this.mood=m;this.moodTime=t}
 escape(){this.tangle=0;this.vy=-140;this.invuln=1.1;this.escapes++;this.moodSet('proud');this.emit('rescue',{text:'You’re free! Nice tapping!'})}
 recover(g){if(this.invuln>0||g.ignored){g.ignored=true;g.near=false;return true}if(g.type==='yarn'){g.ignored=true;g.near=false;this.tangle=1.5;this.taps=0;this.vy=0;this.combo=0;this.moodSet('spooked',2);this.emit('rescue',{text:'YARN TANGLE! Tap 3 times, or wait to escape.'});return true}if(this.armor>0){this.armor=0;g.ignored=true;g.near=false;this.invuln=1.1;this.vy=-120;this.y=clamp(this.y,g.center-g.gap/2+25,g.center+g.gap/2-25);this.combo=0;this.blocks++;this.moodSet('spooked');this.emit('rescue',{text:'Your box saved you! It can block one obstacle.'});return true}if(this.rescues>0){g.ignored=true;g.near=false;return this.rescue(g.center)}return false}
 rescue(y=350){if(this.rescues<=0)return false;this.rescues--;this.usedRescues++;this.y=clamp(y,150,540);this.vy=-130;this.invuln=1.5;this.combo=0;this.moodSet('spooked');this.emit('rescue',{text:'A heart saved you! One heart used.'});return true}
 ability(){const cost=this.cat==='pounce'?65:100;if(this.state!=='playing'||this.charge<cost||this.cooldown>0||this.tangle>0)return false;this.charge-=cost;this.dash=this.cat==='pounce'?.28:.42;this.invuln=Math.max(this.invuln,this.dash+.25);this.cooldown=1.5;this.vy=this.cat==='pounce'?-330:-160;this.dashes++;this.moodSet('zoomies');this.emit('power',{text:this.cat==='pounce'?'AIR POUNCE!':'ZOOMIES! A brief, protected burst.'});return true}
 collect(f){if(f.taken)return;f.taken=true;
  if(f.kind==='box'){this.armor=8;this.emit('power',{text:'BOX SHIELD · blocks one obstacle · lasts 8s'});return}
  if(f.kind==='nip'){this.nip=8;this.charge=100;this.emit('power',{text:'CATNIP RUSH · 8s · double fish + Zoomies ready'});return}
  if(f.kind==='magnet'){this.magnet=7;this.emit('power',{text:'FISH MAGNET · fish come to you for 7s'});return}
  if(f.kind==='life'){const full=this.rescues===2;this.rescues=Math.min(2,this.rescues+1);this.emit('power',{text:full?'HEARTS FULL · 2 / 2':'EXTRA HEART · '+this.rescues+' / 2 extra chances'});return}
  if(f.kind==='yarn'){this.tokens++;this.emit('power',{text:'YARN TOKEN · for your outfit closet'});return}
  const base=f.kind==='gold'?5:f.kind==='mystery'?1+Math.floor(this.rewardRand()*4):1,n=base*(this.nip>0?2:1);this.fish+=n;this.score+=n*3;this.stats.fish+=n*3;this.charge=clamp(this.charge+12,0,100);this.moodSet('excited');this.emit('fish',{x:f.x,y:f.y})}
 pause(){if(this.state==='playing')this.state='paused';else if(this.state==='paused')this.state='playing'}
 end(reason){if(this.state!=='playing')return;if(this.tutorial){this.y=clamp(this.y,120,580);this.vy=-100;this.emit('practice',{text:'Safe practice! A gentle bounce. Try a small flap.'});return;}this.state='over';this.death=reason;this.mood='spooked';this.emit('over',{reason})}
 beginEncounter(){if(this.encounterSeen)return;this.encounterSeen=true;this.encounter=10;this.emit('world',{text:'THE GIANT VACUUM · fly through the open gaps for 10s'})}
 spawn(){
  const type=this.encounter>0?'vacuum':TYPES[this.id%TYPES.length],gap=this.encounter>0?230:C.gap-Math.min(24,this.id*1.2);
  this.center=clamp(this.center+(this.rand()-.5)*120,220,480);
  const g={id:this.id++,x:510,center:this.center,gap,type,age:0,passed:false};this.gates.push(g);
  for(let j=0;j<3;j++)this.items.push({x:g.x+15+j*34,y:g.center+Math.sin(j)*22,kind:j===1&&g.id%4===3?'gold':'fish',taken:false});
  if(g.id%2===1)this.items.push({x:g.x-60,y:g.center,kind:['box','magnet','nip','yarn','mystery','life'][Math.floor(g.id/2)%6],taken:false});
  this.mischief?.spawn(g);
  this.emit('warning',{text:({laundry:'Laundry day. Mind the socks!',pigeon:'Pigeon patrol. Watch the dotted path.',vacuum:'Vacuum ahead. Stay out of the suction.',toast:'Toast incoming. Follow the crumbs.',fan:'Fan ahead. Ride the visible breeze.',yarn:'Yarn trap. Tangled? Tap three times to escape.'})[type]});
 }
 shapes(g){
  const top=g.center-g.gap/2,bottom=g.center+g.gap/2,x=g.x;
  if(g.type==='laundry')return[{x,y:55,w:64,h:Math.max(18,top-55)},{x:x+16,y:bottom,w:54,h:C.floor-bottom}];
  if(g.type==='pigeon'){const sway=Math.sin(g.age*2.4)*13,dive=clamp((g.age-1.4)*80,0,55);return[{x:x+sway-dive,y:top-45,w:70,h:42},{x:x-sway-dive,y:bottom+3,w:70,h:42}]}
  if(g.type==='vacuum')return[{x:x+8,y:top-74,w:58,h:74},{x:x-3,y:bottom,w:80,h:125}];
  if(g.type==='toast'){const bob=Math.sin(g.age*3)*14;return[{x:x+bob,y:top-66,w:58,h:62},{x:x-bob,y:bottom+4,w:58,h:62},{x:x-bob-10,y:bottom+66,w:80,h:35}]}
  if(g.type==='yarn')return[{x,y:top-55,w:60,h:55},{x:x+10,y:bottom,w:60,h:55}];
  return[{x:x-8,y:top-82,w:82,h:82},{x:x-8,y:bottom,w:82,h:82}];
 }
 step(dt){
  if(this.state!=='playing')return;
  this.time+=dt;this.flapAge+=dt;
  if(this.encounter>0){this.encounter=Math.max(0,this.encounter-dt);if(!this.encounter){this.score+=40;this.stats.event=(this.stats.event||0)+40;this.fish+=5;this.emit('power',{text:'VACUUM DEFEATED! +40 points · +5 fish'})}}
  for(const k of ['slow','armor','invuln','comboTimer','moodTime','nip','magnet','dash','cooldown'])this[k]=Math.max(0,this[k]-dt);if(!this.comboTimer)this.combo=0;
  if(this.tangle>0){this.tangle-=dt;if(this.tangle<=0)this.escape();dt*=.25}
  if(this.moodTime<=0)this.mood=this.gates.some(g=>Math.abs(g.x-C.x)<140)?'spooked':this.time%12>10?'sleepy':'curious';
  if(this.slow>0)dt*=.7;
  const speed=(C.speed+Math.min(38,this.passed*1.3))*this.trait.speed;const dx=speed*dt*(this.dash>0?1.85:1);
  this.distance+=dx;const distanceScore=Math.floor(this.distance/80);this.score+=distanceScore-(this.stats.distance||0);this.stats.distance=distanceScore;
  this.next-=dx;if(this.next<=0){this.spawn();this.next+=C.spacing}
  let force=0;
  for(const g of this.gates){g.x-=dx;g.age+=dt;if(g.type==='vacuum'&&Math.abs(g.x-C.x)<130&&this.y>g.center)force+=110*(1-Math.abs(g.x-C.x)/130);if(g.type==='fan'&&Math.abs(g.x-C.x)<80&&this.y>g.center)force-=135}
  this.vy=clamp(this.vy+(C.gravity*this.trait.gravity*(this.world===2?.92:1)*(this.armor>0?1.16:1)+force)*dt,-420,C.maxFall);this.y+=this.vy*dt;
  for(const g of this.gates){
   const d=Math.min(...this.shapes(g).map(r=>g.type==='fan'?Math.max(0,Math.hypot(C.x-r.x-r.w/2,this.y-r.y-r.h/2)-40):rectDistance(C.x,this.y,r)));
   if(d<C.r&&!this.recover(g)){this.end(g.type);return}
   if(d>=C.r&&d<C.r+14&&!g.ignored&&this.invuln<=0)g.near=true;
   if(!g.passed&&g.x+100<C.x){g.passed=true;this.passed++;this.score+=10;this.stats.pass+=10;this.emit('pass');
    if(g.near&&!g.ignored){this.near++;this.combo=Math.min(5,this.combo+1);this.bestCombo=Math.max(this.bestCombo,this.combo);this.comboTimer=7;const points=5*this.combo;this.score+=points;this.stats.near+=points;this.charge=clamp(this.charge+22,0,100);this.slow=.17;this.moodSet('proud');this.emit('near',{text:'PAW-SOME DODGE!  ×'+this.combo})}
    if(this.passed===8)this.emit('warning',{text:'Something enormous is plugging itself in…'});
    if(this.passed===9)this.beginEncounter();
    if(this.passed%6===5)this.emit('warning',{text:['Kitchen portal ahead. Keep flapping!','Dream portal ahead. Gravity gets lighter.','Neighborhood portal ahead. Gravity returns.'][this.world]});
    if(this.passed%6===0){this.world=(this.world+1)%3;this.score+=20;this.stats.world+=20;this.emit('world',{text:['BACK IN THE NEIGHBORHOOD','THE KITCHEN DIMENSION','THE CAT’S DREAM · lighter gravity'][this.world]})}
   }
  }
  for(const f of this.items){f.x-=dx;const d=Math.hypot(f.x-C.x,f.y-this.y);if(this.magnet>0&&['fish','gold','mystery'].includes(f.kind)&&d<155&&d>1){const pull=Math.min(1,dt*6);f.x+=(C.x-f.x)*pull;f.y+=(this.y-f.y)*pull}if(d<C.r+12)this.collect(f)}
  this.mischief?.step(dt,dx);if(this.state!=='playing')return;
  if(this.y<C.r+45||this.y>C.floor-C.r){const reason=this.y<C.r+45?'ceiling':'ground';if(this.invuln>0){this.y=clamp(this.y,C.r+45,C.floor-C.r);this.vy=reason==='ceiling'?100:-130}else if(!this.rescue())this.end(reason)}
  this.gates=this.gates.filter(g=>g.x>-160);this.items=this.items.filter(f=>f.x>-30&&!f.taken);
 }
}
root.CatCore={C,Run,random,rectDistance,clamp,TYPES,ROSTER};if(typeof module!=='undefined')module.exports=root.CatCore;
})(globalThis);
