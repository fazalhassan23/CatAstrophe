/* Optional pounce targets and telegraphed consequences, independent of level RNG. */
(function(root){
'use strict';
const {C,clamp}=CatCore;
const TARGETS={pot:{label:'FLOWERPOT',points:12,fish:2},toast:{label:'STOLEN TOAST',points:8,fish:3},bell:{label:'DOORBELL',points:10,fish:2}};
class System{
 constructor(run){this.run=run;this.targets=[];this.reactions=[];this.counts={pots:0,toast:0,bells:0,pigeons:0};this.serial=0}
 spawn(g){if(g.id<(this.run.mode==='relaxed'?6:3)||g.id%3!==0||this.run.encounter>0)return;const type=['pot','toast','bell'][this.serial%3];this.add(type,g.x-155,g.center-35)}
 add(type,x,y){const target={id:this.serial++,type,x,y:clamp(y,150,550),hit:false,age:0};this.targets.push(target);return target}
 award(points,fish){const r=this.run;r.score+=points;r.stats.mischief=(r.stats.mischief||0)+points;r.fish+=fish}
 strike(t){if(t.hit)return false;const r=this.run;t.hit=true;t.age=0;const reward=TARGETS[t.type];this.award(reward.points,reward.fish);this.counts[t.type==='pot'?'pots':t.type==='toast'?'toast':'bells']++;r.moodSet('proud',1.3);
  r.emit('mischief',{x:t.x,y:t.y,text:(t.type==='pot'?'POT DOWN! Bell incoming…':t.type==='toast'?'BREAKFAST HAS BEEN RELOCATED.':'DING DONG. You are the problem.')+' +'+reward.points+' · +'+reward.fish+' fish'});
  if(t.type==='pot')this.reactions.push({kind:'chain',age:0,x:t.x,y:t.y});
  else if(t.type==='bell')this.queuePigeon(t.y+.0,.65);
  // Stealing toast is a safe alternative: no pursuing pigeon.
  return true;
 }
 queuePigeon(y,delay=0){this.reactions.push({kind:'pigeon',age:-delay,x:490,y:clamp(y,140,550),warn:1.65,hit:false,done:false});this.run.emit('warning',{text:'PIGEON WAKING! Dotted lane = its flight path. Move above or below.'})}
 step(dt,dx){const r=this.run;
  for(const t of this.targets){t.x-=dx;t.age+=dt;if(!t.hit&&r.dash>0&&Math.hypot(t.x-C.x,t.y-r.y)<44)this.strike(t)}
  for(const a of this.reactions){a.age+=dt;
   if(a.kind==='chain'){a.x-=dx*.5;if(a.age>=.45&&!a.done){a.done=true;this.counts.bells++;r.emit('bell',{text:'CLANG! One flowerpot. One bell. One very annoyed pigeon.'});this.queuePigeon(a.y,.25)}continue}
   if(a.age<0)continue;
   if(a.age<a.warn)continue;
   a.x-=250*dt;
   if(!a.hit&&Math.hypot(a.x-C.x,a.y-r.y)<C.r+20){a.hit=true;a.done=true;if(!r.recover({type:'pigeon',center:clamp(r.y,200,500),gap:208})){r.end('pigeon');if(r.tutorial)r.emit('practice',{text:'Safe practice! Move away from the dotted pigeon lane next time.'})}}
   if(!a.done&&a.x<C.x-55){a.done=true;this.counts.pigeons++;this.award(8,1);r.charge=clamp(r.charge+18,0,100);r.moodSet('proud');r.emit('mischief',{x:C.x,y:r.y,text:'PIGEON OUTSMARTED! +8 points · +1 fish'})}
  }
  this.targets=this.targets.filter(t=>t.x>-70&&(!t.hit||t.age<.8));
  this.reactions=this.reactions.filter(a=>a.kind==='chain'?a.age<1.5:!(a.done&&a.x<-60)&&a.age<a.warn+3.5);
 }
}
root.CatMischief={System,TARGETS};if(typeof module!=='undefined')module.exports=root.CatMischief;
})(globalThis);
