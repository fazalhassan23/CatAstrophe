(function(root){
const {C,clamp}=CatCore;
const palettes=[{sky:'#bce9e5',light:'#f5f6df',building:'#c5d6c1',front:'#8fb9aa',accent:'#ed8d64',name:'The Neighborhood'}, {sky:'#f9d6b1',light:'#fff3d8',building:'#dcb49b',front:'#bf8978',accent:'#93c6b3',name:'Kitchen Dimension'},{sky:'#34365b',light:'#aba6db',building:'#555179',front:'#69618b',accent:'#d39ad4',name:"The Cat’s Dream"}];
function rr(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=2.5;c.stroke()}}
function ellipse(c,x,y,rx,ry,fill,stroke){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2.5;c.stroke()}}
function path(c,points,fill,stroke){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=2.5;c.stroke()}}
function line(c,points,color,width=2){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke()}
function fish(c,x,y,gold=false,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);path(c,[[-8,0],[-19,-9],[-19,9]],gold?'#e8ac39':'#ea8d79','#704c45');ellipse(c,0,0,12,8,gold?'#ffcf5a':'#f4a98b','#704c45');ellipse(c,5,-2,1.8,1.8,'#263e3d');line(c,[[-3,-5],[-3,5]],'#fff1cc',2);c.restore()}
function wing(c,x,y,t,color='#7995a1'){
 const lift=Math.sin(t*12)*13;c.save();c.translate(x,y);
 path(c,[[-8,2],[-15,-5+lift],[0,-9+lift],[12,2]],color,'#4f6269');
 line(c,[[-8,-2],[-4,-4+lift],[2,-3+lift]],'#b7c8c8',1.5);c.restore();
}
// Pure decorative poses. No random state or simulation changes.
function personality(id,t=0,motion=true,idle=true){
 if(!motion)return{hop:0,breath:1,ear:0,tail:0,paw:0,blink:0};
 const pulse=(period,start,length)=>{const phase=((t%period)+period)%period;return phase>=start&&phase<=start+length?Math.sin((phase-start)/length*Math.PI):0};
 const coco=id==='mochi',pepe=id==='pounce';
 return{hop:idle&&!coco&&!pepe?-3*pulse(5.5,2.8,.65):0,
 breath:1+Math.sin(t*(coco?1.6:2.2))*(coco?.012:.006),
 ear:coco?Math.sin(t*1.8)*.7:pepe?pulse(6,3,.55)*2:pulse(4.5,1.8,.5)*2.5,
 tail:coco?Math.sin(t*1.5)*.08:pepe?Math.sin(t*14)*pulse(5.8,2.6,.7)*.2:Math.sin(t*3)*.12,
 paw:Math.sin(t*(coco?2:pepe?4:5))*(coco?1:2),
 blink:pulse(coco?6.8:pepe?7.5:5.8,coco?3:2.2,coco?1.1:.22)};
}
function cat(c,x,y,t=0,id='biscuit',mood='curious',flap=0,rotation=0,outfit='none',options={}){
 const ink='#493e3a',coco=id==='mochi',pepe=id==='pounce',luna=!coco&&!pepe,coat=coco?'#777982':pepe?'#b9a080':'#e7a45b',light='#fff9ef';
 const motion=options.motion!==false,pose=personality(id,t,motion,options.idle!==false);if(!motion)t=0;
 c.save();c.translate(x,y+pose.hop);c.rotate(rotation);c.scale(1,pose.breath);if(luna)c.scale(.94,.94);const bounce=Math.max(0,1-flap*5);c.scale(1+bounce*.1,1-bounce*.07);
 // A separate articulated tail, four paws, ears, head, eyes and costume.
 c.save();c.rotate(pose.tail);line(c,[[-18,7],[-38,8],[-48,-1],[-45,-13]],ink,id==='mochi'?17:13);line(c,[[-18,7],[-38,8],[-48,-1],[-45,-13]],coat,id==='mochi'?12:8);if(pepe){line(c,[[-48,-1],[-45,-13]],ink,8)}c.restore();
 const paw=motion?Math.sin(t*10+flap*14)*6+pose.paw:0;
 ellipse(c,-14,23+paw,8,12,light,ink);ellipse(c,14,23-paw,8,12,light,ink);
 ellipse(c,-2,5,id==='mochi'?32:27,id==='mochi'?28:24,coat,ink);ellipse(c,4,12,coco?23:18,coco?22:17,light);
 if(coco){for(let i=0;i<8;i++){const a=i*Math.PI/4;ellipse(c,Math.cos(a)*26,Math.sin(a)*22+4,8,8,a>0&&a<Math.PI?light:coat)}ellipse(c,4,14,22,18,light)}
 const earTop=coco?-34:pepe?-48:-43;path(c,[[-21,-12],[-25-pose.ear,earTop],[-5,-26]],coat,ink);path(c,[[8,-26],[28+pose.ear,earTop+2],[26,-7]],coat,ink);
 path(c,[[-19,-22],[-22-pose.ear,earTop+8],[-11,-26]],'#e4b1ae');path(c,[[15,-25],[24+pose.ear,earTop+9],[23,-20]],'#e4b1ae');
 ellipse(c,4,-10,29,24,coat,ink);if(coco){ellipse(c,-20,-2,9,11,coat);ellipse(c,28,-2,9,11,coat)}
 // White facial blaze, muzzle and chest follow the family photographs.
 path(c,[[3,-33],[9,-33],[11,-20],[17,-5],[23,7],[8,13],[-9,7],[-6,-4],[1,-19]],light);ellipse(c,7,2,20,12,light);
 if(id==='biscuit'){line(c,[[-6,-32],[-3,-23]],'#b87549',3);line(c,[[4,-33],[6,-24]],'#b87549',3);line(c,[[15,-30],[14,-22]],'#b87549',3)}
 if(pepe){line(c,[[-13,-24],[-6,-21]],'#78664e',2.5);line(c,[[17,-22],[23,-25]],'#78664e',2.5)}
 c.save();c.translate(0,-10);c.scale(1,1-pose.blink*.93);c.translate(0,10);
 const sleepy=mood==='sleepy',happy=mood==='excited'||mood==='proud';
 if(sleepy||happy){line(c,[[-9,-9],[-4,happy?-13:-7],[1,-9]],ink,2.5);line(c,[[13,-9],[18,happy?-13:-7],[23,-9]],ink,2.5)}
 else{const iris=coco?'#d4aa4b':pepe?'#9baf70':'#9baf9b';ellipse(c,-4,-10,6,7,iris,ink);ellipse(c,18,-10,6,7,iris,ink);ellipse(c,-4,-10,mood==='spooked'?5:3.8,mood==='spooked'?7:5.5,ink);ellipse(c,18,-10,mood==='spooked'?5:3.8,mood==='spooked'?7:5.5,ink);ellipse(c,-3,-12,1.3,1.7,'#fff');ellipse(c,19,-12,1.3,1.7,'#fff')}
 c.restore();
 path(c,[[4,-2],[11,-2],[7,2]],coco?'#a6767e':'#de9b9d');line(c,[[7,3],[7,5],[3,7]],ink,1.7);line(c,[[7,5],[11,7]],ink,1.7);
 for(let s of [-1,1])for(let j=0;j<2;j++)line(c,[[7+s*16,1+j*4],[7+s*32,-1+j*8]],ink,1.5);
 // White forepaws remain visible at the sides without changing the flight hitbox.
 ellipse(c,-20,17+pose.paw,6,8,light,ink);ellipse(c,25,17-pose.paw,6,8,light,ink);
 if(outfit==='goggles'){rr(c,-15,-20,17,15,5,'#adcfcc',ink);rr(c,11,-20,17,15,5,'#adcfcc',ink);line(c,[[2,-13],[11,-13]],ink,3)}
 if(outfit==='crown')path(c,[[-14,-31],[-18,-48],[-6,-41],[2,-53],[10,-41],[22,-49],[19,-30]],'#efc766',ink);
 c.restore();
}
// Decorative room scene; all three family cats belong here, including locked flyers.
function home(c,t,selected='biscuit',motion=true,outfit='none'){
 if(!motion)t=0;c.clearRect(0,0,600,230);
 rr(c,0,0,600,230,18,'#f1e6d2');
 rr(c,38,18,130,114,12,'#fff8e9','#b9c8b5');rr(c,46,26,114,98,8,'#c9e8e1');
 ellipse(c,127,49,14,14,'#fff4cc');line(c,[[103,27],[103,124]],'#fff8e9',5);line(c,[[46,75],[160,75]],'#fff8e9',5);
 rr(c,192,36,44,52,4,'#d0ac87');path(c,[[201,70],[214,51],[227,70]],'#fff2d6');ellipse(c,215,75,8,8,'#fff2d6');
 rr(c,430,90,115,35,8,'#a8bfa8');line(c,[[442,125],[442,169]],'#8b967c',5);line(c,[[533,125],[533,169]],'#8b967c',5);
 rr(c,474,53,30,37,4,'#c68f70');line(c,[[489,54],[489,24]],'#6c936b',4);ellipse(c,477,35,14,6,'#8ca979');ellipse(c,500,25,14,6,'#9bb486');
 rr(c,0,169,600,61,0,'#d5b58f');line(c,[[0,169],[600,169]],'#ba9e7c',2);
 ellipse(c,300,202,239,23,'#e8d5ac');
 const spots=[{id:'biscuit',x:125},{id:'mochi',x:300},{id:'pounce',x:475}];
 for(const spot of spots){
  if(spot.id===selected)ellipse(c,spot.x,205,56,13,'#b4cbb4');
  c.save();c.translate(spot.x,153);c.scale(1.12,1.12);
  cat(c,0,0,t,spot.id,'curious',1,0,spot.id===selected?outfit:'none',{motion,idle:true});c.restore();
 }
}
// Decorative cycles use elapsed simulation time, never course randomness.
function ambience(seed,time,world,motion=true){const phase=((time+Math.abs(seed%13))%36)/36;return{strength:motion?Math.sin(Math.PI*phase)**4*.18:0,kind:['rain','crumbs','fireflies'][world]||'rain',surprise:motion&&time%28>19&&time%28<25,phase:motion?time:0}}
class Renderer{
 constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d');this.particles=[];this.debug=false;this.motion=true;this.world=0;this.palette={...palettes[0]}}
 burst(x,y,type){if(!this.motion)return;for(let i=0;i<12;i++)this.particles.push({x,y,vx:(Math.random()-.5)*160,vy:(Math.random()-.6)*170,life:.6,kind:type});this.particles=this.particles.slice(-120)}
 draw(run,t,dt){const c=this.c,target=palettes[run?.world||0];
  for(const key of ['sky','light','building','front','accent']){const a=this.palette[key],b=target[key],alpha=this.motion?Math.min(1,Math.max(dt,.016)*3):1;let color='#';for(let i=1;i<7;i+=2){const from=parseInt(a.slice(i,i+2),16),to=parseInt(b.slice(i,i+2),16);color+=Math.round(from+(to-from)*alpha).toString(16).padStart(2,'0')}this.palette[key]=color}
  const p=this.palette;if(!this.motion)t=0;c.clearRect(0,0,C.W,C.H);c.fillStyle=p.sky;c.fillRect(0,0,C.W,C.H);const distance=run?.distance||t*14;
  // Three parallax layers; all decorative scenery is low contrast.
  ellipse(c,360,123,43,43,p.light);for(let i=0;i<5;i++){const x=((i*137-distance*.12)%650+650)%650-100,y=85+(i%3)*95;ellipse(c,x,y,44,13,p.light);ellipse(c,x+20,y-8,23,18,p.light)}
  for(let i=0;i<7;i++){const x=((i*90-distance*.22)%630+630)%630-90,h=115+(i%3)*55;rr(c,x,565-h,78,h+120,6,p.building);if((run?.world||0)===0){path(c,[[x-6,565-h],[x+39,535-h],[x+84,565-h]],p.building)}for(let j=0;j<3;j++)rr(c,x+12+j*19,590-h,9,15,3,p.light)}
  if((run?.world||0)===1){for(let i=0;i<5;i++)rr(c,i*105-25,540,90,120,8,'#d2aa8e','#c69b83')}
  if((run?.world||0)===2){for(let i=0;i<14;i++){const x=(i*113+20)%450,y=(i*73)%510;c.fillStyle='#f5d999';c.fillRect(x,y,2,3)}for(let i=0;i<3;i++){c.save();c.translate(i*190-distance*.08%190,560);c.rotate(-.2);rr(c,-35,-18,70,36,12,'#c1b5e0');c.restore()}}
  if(run)this.environment(run);
  if(run?.encounter>0){rr(c,350,85,110,120,27,'#997484','#604b68');rr(c,363,105,70,29,11,'#f3ceb0','#604b68');ellipse(c,382,117,6,6,'#493e3a');ellipse(c,417,117,6,6,'#493e3a');for(let i=0;i<4;i++)line(c,[[370,151+i*10],[438,151+i*10]],'#604b68',4);c.font='bold 11px Arial';c.fillStyle='#604b68';c.fillText('SUCK-O-MATIC',340,70);c.fillText(Math.ceil(run.encounter)+'s',390,222)}
  if(run){for(const g of run.gates)this.obstacle(g,t,run);for(const f of run.items)this.item(f,t);this.mischief(run,t);this.discovery(run)}
  c.fillStyle=p.front;c.fillRect(0,C.floor,450,60);line(c,[[0,C.floor],[450,C.floor]],'#5a8277',3);
  for(let i=0;i<17;i++){const x=((i*35-distance*.6)%595+595)%595;line(c,[[x,C.floor+10],[x+10,C.floor+10]],'#d8e5c3',3)}
  const y=run?run.y:330+Math.sin(t*2)*8;
  if(run?.dash>0){c.fillStyle='#fff4c780';for(let i=1;i<5;i++)ellipse(c,C.x-i*22,y,24-i*3,14-i*2,'#fff4c780')}
  if(run?.armor>0){c.save();c.translate(C.x,y);c.rotate(Math.sin(t*5)*.09);rr(c,-33,-23,66,47,6,'#c99865','#75553f');line(c,[[-32,-20],[-45,-30],[-17,-31]],'#75553f',3);c.restore()}
  // Reduced motion uses a steady protection ring and never hides the character.
  if(!this.motion&&run?.invuln>0){c.save();c.strokeStyle='#527f75';c.lineWidth=2.5;c.beginPath();c.arc(C.x,y,43,0,Math.PI*2);c.stroke();c.restore()}
  if(!this.motion||!run||run.invuln<=0||Math.sin(t*30)>0)cat(c,C.x,y,t,run?.cat||'biscuit',run?.mood||'curious',run?.flapAge||1,run?.tangle>0?Math.sin(t*8)*.45:clamp((run?.vy||0)/900,-.3,.55),run?.outfit||'none',{motion:this.motion,idle:!run});
  if(run?.tangle>0){ellipse(c,C.x,y+12,29,19,'#bda1d080','#825e9e');for(let i=0;i<4;i++)line(c,[[C.x-26,y-8+i*8],[C.x+27,y+15-i*4]],'#825e9e',2)}
  if(run?.nip>0){for(let i=0;i<5;i++){const a=t*4+i*1.25;ellipse(c,C.x+Math.cos(a)*40,y+Math.sin(a)*32,2.5,2.5,'#fff3ac')}}
  if(run?.magnet>0){c.save();c.setLineDash([3,8]);c.strokeStyle='#fcf0c199';c.lineWidth=1.5;c.beginPath();c.arc(C.x,y,55+Math.sin(t*4)*5,0,7);c.stroke();c.restore()}
  for(const a of this.particles){a.life-=dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=150*dt;c.globalAlpha=Math.max(0,a.life/.6);ellipse(c,a.x,a.y,3,3,a.kind==='near'?'#fff3bd':'#ed9e6e');if(a.kind==='near'){ellipse(c,a.x-4,a.y-4,1.5,1.5,'#fff3bd');ellipse(c,a.x+4,a.y-4,1.5,1.5,'#fff3bd')}}c.globalAlpha=1;this.particles=this.particles.filter(a=>a.life>0);
  if(this.debug&&run){c.strokeStyle='#e94765';c.beginPath();c.arc(C.x,run.y,C.r,0,7);c.stroke();for(const g of run.gates){for(const r of run.shapes(g))c.strokeRect(r.x,r.y,r.w,r.h);c.strokeStyle='#268c72';c.strokeRect(g.x,g.center-g.gap/2,90,g.gap);c.strokeStyle='#e94765'}}
 }
 environment(run){const c=this.c,a=ambience(run.seed,run.time,run.world,this.motion);c.save();c.globalAlpha=a.strength;
  for(let i=0;i<22;i++){const x=(i*83+a.phase*18)%C.W,y=(i*61+a.phase*(a.kind==='rain'?42:9))%560;
   if(a.kind==='rain')line(c,[[x,y],[x-3,y+12]],'#527f85',1);else ellipse(c,x,y,2,2,a.kind==='fireflies'?'#fff4b9':'#fff1d2');}
  if(a.surprise){c.globalAlpha=.35;const x=350+Math.sin(a.phase)*12,y=160;
   if(run.cat==='biscuit'){ellipse(c,x-5,y,6,9,'#bc7e9b');ellipse(c,x+5,y,6,9,'#bc7e9b');line(c,[[x,y-6],[x,y+7]],'#765c7b',2)}
   else if(run.cat==='mochi'){ellipse(c,x,y,27,10,'#fffbed');ellipse(c,x-8,y-7,12,12,'#fffbed');ellipse(c,x+9,y-4,14,13,'#fffbed')}
   else{rr(c,x-18,525,36,25,3,'#cba77d');line(c,[[x-18,525],[x,534],[x+18,525]],'#92785b',2)}}c.restore();
 }
 discovery(run){const c=this.c;for(const trail of run.discoveries?.trails||[]){c.save();c.setLineDash([2,6]);line(c,trail.points.map(p=>[p.x,p.y]),'#8a7455',1);c.setLineDash([]);for(const p of trail.points)if(!p.taken){path(c,[[p.x,p.y-8],[p.x+3,p.y-3],[p.x+8,p.y],[p.x+3,p.y+3],[p.x,p.y+8],[p.x-3,p.y+3],[p.x-8,p.y],[p.x-3,p.y-3]],'#fff1a6','#8a7455')}c.restore()}}
 mischief(run,t){
  const c=this.c,m=run.mischief;if(!m)return;
  for(const a of m.reactions){
   if(a.kind==='chain'){
    c.save();c.translate(a.x,a.y+Math.min(55,a.age*95));c.rotate(Math.sin(a.age*20)*.4);
    path(c,[[-10,8],[-7,-6],[0,-12],[7,-6],[10,8]],'#e3bf66','#75634c');line(c,[[-13,8],[13,8]],'#75634c',3);ellipse(c,0,12,3,3,'#75634c');c.restore();continue;
   }
   if(a.age<0)continue;
   if(a.age<a.warn){c.save();c.setLineDash([5,8]);line(c,[[22,a.y],[430,a.y]],'#a45e60',2);c.restore();c.fillStyle='#80484b';c.font='bold 10px Arial';c.fillText('PIGEON LANE · MOVE AWAY',155,a.y-12);continue}
   c.save();c.translate(a.x,a.y);ellipse(c,0,0,23,15,'#91a3ac','#4f6269');ellipse(c,-19,-9,12,11,'#a0b4b2','#4f6269');
   path(c,[[-30,-9],[-40,-4],[-29,-1]],'#d6aa6e');ellipse(c,-23,-12,2,2,'#273e3a');wing(c,3,0,this.motion?t+a.y*.01:0);
   c.restore();
  }
  for(const target of m.targets){
   const {x,y,type,hit}=target;c.save();c.translate(x,y);
   if(hit){c.globalAlpha=Math.max(0,1-target.age/.8);for(let i=0;i<5;i++){const angle=i*1.3;path(c,[[Math.cos(angle)*target.age*70,Math.sin(angle)*target.age*45],[Math.cos(angle)*target.age*70+8,Math.sin(angle)*target.age*45+4],[Math.cos(angle)*target.age*70-2,Math.sin(angle)*target.age*45+10]],'#d38d6a')}c.restore();continue}
   c.save();c.setLineDash([4,5]);c.strokeStyle=run.charge>=(run.cat==='pounce'?65:100)?'#b87743':'#82a68e';c.lineWidth=2;c.beginPath();c.arc(0,0,32+Math.sin(t*4)*2,0,7);c.stroke();c.restore();
   if(type==='pot'){path(c,[[-17,-3],[17,-3],[12,22],[-12,22]],'#d59b7c','#7c5a47');rr(c,-20,-7,40,7,3,'#e4b18c','#7c5a47');line(c,[[0,-7],[0,-24]],'#567e56',3);ellipse(c,-8,-21,10,5,'#79a56c');ellipse(c,9,-28,10,5,'#95b67c');line(c,[[0,29],[0,42]],'#bdaf8b',1.5);path(c,[[-7,56],[-5,45],[0,41],[5,45],[7,56]],'#e1c478','#7a6549');ellipse(c,0,59,2,2,'#7a6549')}
   if(type==='toast'){rr(c,-19,-22,38,42,9,'#bc8556','#7c5a47');rr(c,-15,-18,30,34,7,'#f3d39b');rr(c,-7,-5,14,10,3,'#fff0b3')}
   if(type==='bell'){path(c,[[-17,12],[-13,-10],[0,-22],[13,-10],[17,12]],'#dfc079','#7a6549');line(c,[[-20,13],[20,13]],'#7a6549',3);ellipse(c,0,19,4,4,'#7a6549')}
   c.font='bold 8px Arial';c.textAlign='center';c.fillStyle='#4b6656';c.fillText(type==='pot'?'POT → BELL → PIGEON':type==='bell'?'BELL → PIGEON':'STEAL SOME TOAST',0,type==='pot'?78:48);
   c.fillText('POUNCE WITH X',0,-43);c.restore();
  }
 }
 item(f,t){const c=this.c;if(f.kind==='fish'||f.kind==='gold'){fish(c,f.x,f.y,f.kind==='gold');if(f.kind==='gold'){c.font='bold 13px Arial';c.fillStyle='#b77a2b';c.fillText('✦',f.x+8,f.y-12)}return}c.save();c.translate(f.x,f.y+Math.sin(t*4)*3);ellipse(c,0,0,16,16,'#fff4de','#725e68');c.font='20px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(({nip:'❧',magnet:'∩',box:'□',yarn:'≋',life:'♥',mystery:'?'})[f.kind]||'★',0,0);c.font='bold 8px Arial';c.fillStyle='#493e3a';c.fillText(f.kind.toUpperCase(),0,25);c.restore()}
 obstacle(g,t,run){const c=this.c,sh=run.shapes(g);for(let k=0;k<sh.length;k++){const r=sh[k],x=r.x,y=r.y,w=r.w,h=r.h;
  if(g.type==='laundry'){line(c,[[x-17,y+4],[x+w+17,y+4]],'#6f6d59',2);if(k===0){path(c,[[x,y+8],[x+14,y+8],[x+19,y+17],[x+44,y+17],[x+50,y+8],[x+w,y+8],[x+w,y+35],[x+51,y+35],[x+51,y+h],[x+12,y+h],[x+12,y+35],[x,y+35]],'#e9987d','#785d51');line(c,[[x+31,y+24],[x+31,y+h-8]],'#f4c8a5',2)}else{rr(c,x,y,w,h,7,'#799eac','#546d78');for(let i=0;i<4;i++)line(c,[[x+6,y+15+i*14],[x+w-6,y+15+i*14]],'#afc9ce',3)}}
  if(g.type==='pigeon'){c.save();c.setLineDash([4,6]);line(c,[[x-80,y+24],[x+150,y+24]],'#7f8f93',1.5);c.restore();ellipse(c,x+34,y+22,27,17,'#8f9ea9','#4f6269');ellipse(c,x+53,y+9,14,12,'#97b4b3','#4f6269');path(c,[[x+65,y+10],[x+77,y+15],[x+65,y+18]],'#dca36a');ellipse(c,x+56,y+6,2,2,'#263e3d');wing(c,x+32,y+21,this.motion?t+g.id*.7+k:0)}
  if(g.type==='vacuum'){rr(c,x,y,w,h,15,'#b48591','#6b5166');rr(c,x+10,y+12,w-20,30,8,'#e8c5b2','#6b5166');for(let j=0;j<3;j++)line(c,[[x+14,y+54+j*8],[x+w-14,y+54+j*8]],'#6b5166',3);if(k===1){c.save();c.globalAlpha=.35;path(c,[[x,y],[x-80,y-90],[x+w+80,y-90],[x+w,y]],'#fff8dd');c.restore();for(let j=0;j<3;j++)line(c,[[x-30+j*38,y-60],[x+10+j*14,y-20]],'#faf1d3',2)}}
  if(g.type==='toast'){if(k===2){rr(c,x,y,w,h,10,'#9da9a5','#647c78');continue}rr(c,x,y,w,h,13,'#b6774e','#775139');rr(c,x+5,y+5,w-10,h-10,10,'#f4d49e');rr(c,x+19,y+23,18,13,4,'#f7e2a2')}
  if(g.type==='fan'){const cx=x+w/2,cy=y+h/2;ellipse(c,cx,cy,40,40,'#d6ded080','#657e76');c.save();c.translate(cx,cy);c.rotate(this.motion?t*3:0);for(let j=0;j<4;j++){c.rotate(Math.PI/2);ellipse(c,0,-19,9,19,'#8eafa1','#657e76')}c.restore();ellipse(c,cx,cy,8,8,'#f2dab0','#657e76');if(k===1)for(let j=0;j<3;j++)line(c,[[cx-20+j*20,cy-67],[cx-15+j*20,cy-100]],'#fff3ca',2)}
  if(g.type==='yarn'){ellipse(c,x+w/2,y+h/2,w/2,h/2,'#b19ac8','#785c92');for(let j=0;j<4;j++)line(c,[[x+8,y+12+j*8],[x+w-8,y+h-12-j*8]],'#e0cde9',2)}
 }
 }
}
root.CatArt={Renderer,cat,fish,rr,palettes,personality,home,ambience};
})(globalThis);
