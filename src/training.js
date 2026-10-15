/* Short, event-driven walkthrough using real flight and pounce mechanics. */
(function(root){
'use strict';
const {C,clamp}=CatCore;
const STEPS=[
 {title:'01 · Tiny paws, big confidence',text:'Tap the sky or press Space / ↑ three times. Let go to fall. There are no fatal crashes in practice.'},
 {title:'02 · Follow the fish',text:'Catch three fish. These practice fish float near your height. Small, spaced-out flaps keep you level. Fish charge your ability.'},
 {title:'03 · Your first terrible decision',text:'The practice pot follows your height and waits nearby. Press X or tap ZOOMIES when it arrives. In real flights, aim and time your pounce.'},
 {title:'04 · Get away with it',text:'The pot rang a bell! The dotted line warns where the pigeon will fly. Move above or below it, then let it pass.'}
];
class Walkthrough{
 constructor(run){this.run=run;this.stage=0;this.complete=false;this.retry=0;run.tutorial=true;run.flaps=0;run.next=Infinity;run.gates=[];run.items=[];run.vy=0;run.charge=0;run.mischief.targets=[];run.mischief.reactions=[];run.emit('practice',{text:'SAFE PRACTICE · learn at your own pace'})}
 next(stage){this.stage=stage;this.retry=0;this.run.emit('practice',{text:STEPS[stage]?.title||'CLEARED FOR TAKEOFF!'})}
 step(dt){const r=this.run;if(this.complete||r.state!=='playing')return;this.retry+=dt;
  if(this.stage===0&&r.flaps>=3)this.next(1);
  if(this.stage===1){for(const f of r.items)f.y=clamp(r.y+Math.sin(f.x/45)*6,130,620);if(r.fish>=3){r.items=[];r.charge=100;this.next(2)}else if(!r.items.length){const y=clamp(r.y,130,620);for(let j=0;j<3;j++)r.items.push({x:230+j*42,y:y+Math.sin(j)*6,kind:'fish',taken:false})}}
  if(this.stage===2){
   for(const t of r.mischief.targets)if(!t.hit){t.y=clamp(r.y-20,130,600);if(r.dash<=0)t.x=Math.max(t.x,C.x+80)}
   if(r.mischief.counts.pots>0)this.next(3);
   else if(r.cooldown<=0&&r.dash<=0){
    if(r.charge<100){r.charge=100;r.emit('practice',{text:'Missed it? Recharged! Try again when the pot is close.'})}
    if(!r.mischief.targets.some(t=>!t.hit))r.mischief.add('pot',300,clamp(r.y-20,130,600));
   }
  }
  if(this.stage===3){if(r.mischief.counts.pigeons>0){this.complete=true;r.emit('graduated',{text:'A LICENSED LITTLE MENACE. You’re ready!'})}else if(!r.mischief.reactions.some(a=>a.kind==='chain'||(a.kind==='pigeon'&&!a.done))&&this.retry>2){r.mischief.queuePigeon(clamp(r.y,180,500));this.retry=0}}
 }
 get hint(){if(this.stage===2){if(this.run.cooldown>0&&this.run.mischief.counts.pots===0)return 'Recharging for another try… The practice pot will wait.';const target=this.run.mischief.targets.find(t=>!t.hit);if(target&&target.x>C.x-25&&target.x<C.x+115)return 'POT CLOSE! Press X or tap ZOOMIES now.'}return STEPS[this.stage]?.text||''}
}
root.CatTraining={Walkthrough,STEPS};if(typeof module!=='undefined')module.exports=root.CatTraining;
})(globalThis);
