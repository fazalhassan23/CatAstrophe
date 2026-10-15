const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {Run,C}=require('../src/core.js');require('../src/mischief.js');const {Walkthrough}=require('../src/training.js');require('../src/render.js');const save=require('../src/save.js');
function enterPounce(){const r=new Run(17),w=new Walkthrough(r);r.flap();r.flap();r.flap();w.step(0);for(let i=0;i<1800&&w.stage<2;i++){if(r.y>360&&r.vy>0)r.flap();r.step(1/120);w.step(1/120)}assert.equal(w.stage,2);assert.equal(r.charge,100);return{r,w}}
function fly(r,w,frames){for(let i=0;i<frames;i++){if(r.y>360&&r.vy>0)r.flap();r.step(1/120);w.step(1/120)}}
test('QA-01: early pounce recharges after cooldown and can retry through graduation',()=>{
 const {r,w}=enterPounce();r.ability();fly(r,w,65);assert.equal(w.stage,2);assert.equal(r.charge,0);assert.ok(r.cooldown>0);assert.match(w.hint,/Recharging/);
 r.pause();const cooldown=r.cooldown;fly(r,w,200);assert.equal(r.charge,0);assert.equal(r.cooldown,cooldown);r.pause();fly(r,w,150);assert.equal(w.stage,2);assert.equal(r.charge,100);assert.ok(r.mischief.targets.some(t=>!t.hit));
 assert.equal(r.ability(),true);
 for(let i=0;i<1800&&!w.complete;i++){const bird=r.mischief.reactions.find(a=>a.kind==='pigeon'&&!a.done),target=w.stage===3&&bird?Math.min(500,bird.y+110):350;if(r.y>target+10&&r.vy>0)r.flap();r.step(1/120);w.step(1/120)}
 assert.equal(w.complete,true);assert.equal(r.mischief.counts.pots,1);assert.equal(r.mischief.counts.bells,1);assert.equal(r.mischief.counts.pigeons,1);
 const store=new save.Store({getItem(){return null},setItem(){}});r.state='over';assert.equal(store.settle(r),null);assert.equal(store.data.balance,0);
});
test('QA-01: normal flights do not receive free practice charge',()=>{const r=new Run(1);r.charge=100;r.ability();for(let i=0;i<300;i++){r.y=350;r.vy=0;r.next=Infinity;r.step(1/120)}assert.equal(r.charge,0)});
test('QA-04: actual frame loop advances equally at 10, 15, 30 and 60 FPS',()=>{for(const fps of [10,15,30,60]){const app=appHarness();app.click('Play now · skip practice');const r=app.step();r.next=Infinity;r.invuln=100;for(let i=0;i<fps*4;i++){r.y=350;r.vy=0;app.step(1000/fps)}assert.ok(Math.abs(r.time-4)<.01,fps+' FPS: '+r.time)}});
test('QA-04: long frame stalls pause without advancing gameplay',()=>{const app=appHarness();app.click('Play now · skip practice');const r=app.step(),before=r.time;app.step(2000);assert.equal(r.state,'paused');assert.equal(r.time,before);app.click('Resume flight');app.step(2000);assert.equal(r.state,'playing');assert.equal(r.time,before)});
function trace(motion,invuln,time){const calls=[],state={};const ctx=new Proxy(state,{get(t,k){if(k in t)return t[k];return(...args)=>calls.push({fn:k,args,stroke:t.strokeStyle})},set(t,k,v){t[k]=v;return true}});const renderer=new CatArt.Renderer({getContext(){return ctx}});renderer.motion=motion;const r=new Run(1);r.invuln=invuln;renderer.draw(r,time,1/120);return calls}
test('QA-02: protected cat stays visible at every sampled reduced-motion frame',()=>{for(const timer of [.5,1.1,1.5])for(let frame=0;frame<60;frame++){const calls=trace(false,timer,frame/60);assert.ok(calls.some(c=>c.fn==='stroke'&&c.stroke==='#493e3a'));assert.ok(calls.some(c=>c.fn==='stroke'&&c.stroke==='#527f75'))}});
test('QA-02: static protection ring disappears after protection, normal blink still works',()=>{assert.ok(!trace(false,0,0).some(c=>c.stroke==='#527f75'));assert.ok(trace(false,0,0).some(c=>c.fn==='stroke'&&c.stroke==='#493e3a'));assert.ok(trace(true,1,.05).some(c=>c.fn==='stroke'&&c.stroke==='#493e3a'));assert.ok(!trace(true,1,0).some(c=>c.fn==='stroke'&&c.stroke==='#493e3a'))});
// Run the actual application input handler with a minimal DOM. No copied keyboard logic.
function appHarness(){
 class Element{constructor(tag='div'){this.tag=tag;this.children=[];this.style={};this.textContent='';this.classList={toggle(){}}}append(...nodes){this.children.push(...nodes)}prepend(...nodes){this.children.unshift(...nodes)}get firstChild(){return this.textNode??={textContent:''}}get firstElementChild(){return this.first??=new Element()}querySelector(){return new Element()}setAttribute(){}addEventListener(){}focus(){}closest(){return null}getContext(){return new Proxy({},{get(){return()=>{}}})}}
 const nodes=new Map(),handlers={};const document={querySelector(s){if(!nodes.has(s))nodes.set(s,new Element());return nodes.get(s)},querySelectorAll(){return[]},createElement(tag){return new Element(tag)},addEventListener(k,f){handlers[k]=f}};
 let nextFrame,lastRun,ms=0;const storage={value:null,getItem(){return this.value},setItem(k,v){this.value=v}};
 const context={document,window:{addEventListener(){}},CatCore,CatMischief,CatTraining,CatSave:save,CatArt:{cat(){},Renderer:class{constructor(){this.c={scale(){}}}burst(){}draw(r){lastRun=r}}},CatAudio:class{init(){}play(){}},localStorage:storage,matchMedia(){return{matches:false}},URLSearchParams,location:{search:''},requestAnimationFrame(f){nextFrame=f},console};
 vm.runInNewContext(fs.readFileSync(require.resolve('../src/app.js'),'utf8'),context);
 function click(text){const visit=n=>{if(n.textContent===text&&n.onclick){n.onclick();return true}return(n.children||[]).some(visit)};assert.ok(visit(nodes.get('#screen').firstElementChild),'button missing: '+text)}
 function key(code,target={closest(){return null}},repeat=false){let prevented=false;handlers.keydown({code,target,repeat,preventDefault(){prevented=true}});return prevented}
 return{key,click,nodes,step(delta=1000/60){ms+=delta;nextFrame(ms);return lastRun},progress(){return JSON.parse(storage.value)}};
}
test('QA-03: native form controls and descendants retain arrow, Space and text keys',()=>{const app=appHarness();app.click('Settings');for(const code of ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyP','KeyX']){const target={closest(selector){return selector.includes('input')?{}:null}};assert.equal(app.key(code,target),false,code)}assert.equal(app.key('ArrowUp'),false,'settings background should not consume flight keys')});
test('QA-03: flight shortcuts still start/flap and pause/resume; button Space stays native',()=>{const app=appHarness();assert.equal(app.key('Space',{closest(s){return s==='button,a'?{}:null}}),false);assert.equal(app.key('ArrowUp'),true);assert.equal(app.nodes.get('#lesson').hidden,false);assert.equal(app.key('Space'),true);assert.equal(app.key('KeyP'),true);assert.equal(app.key('ArrowUp'),false,'paused flight must not consume arrows');assert.equal(app.key('KeyP'),true);assert.equal(app.key('ArrowUp'),true)});
test('QA-01: application walkthrough recovers an early pounce, shows graduation and saves completion',()=>{
 const app=appHarness();app.key('Space');let r=app.step();app.key('Space');app.key('Space');app.key('Space');let attemptedEarly=false,retried=false;
 for(let frame=0;frame<60*30&&r.state!=='complete';frame++){
  const bird=r.mischief.reactions.find(a=>a.kind==='pigeon'&&!a.done),target=bird?Math.min(500,bird.y+110):350;
  if(r.y>target+10&&r.vy>0)app.key('Space');
  if(r.fish===3&&r.mischief.counts.pots===0&&r.charge===100){if(!attemptedEarly){assert.ok(r.mischief.targets.some(t=>t.x>C.x+150));app.key('KeyX');attemptedEarly=true}else if(r.cooldown===0){app.key('KeyX');retried=true}}
  r=app.step();
 }
 assert.equal(attemptedEarly,true);assert.equal(retried,true);assert.equal(r.state,'complete');assert.match(app.nodes.get('#screen').innerHTML,/WALKTHROUGH COMPLETE/);assert.equal(app.nodes.get('#lesson').hidden,true);assert.equal(app.progress().walkthroughComplete,true);assert.equal(app.progress().balance,0);app.click('My first real flight  →');r=app.step();assert.equal(r.state,'playing');assert.ok(!r.tutorial);assert.equal(r.charge,0);
});
