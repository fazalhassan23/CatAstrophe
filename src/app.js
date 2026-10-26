/* DOM menus and input; a single animation loop drives the pure simulation. */
(function(){
'use strict';
const $=s=>document.querySelector(s),{C,Run,ROSTER}=CatCore,canvas=$('#game');
const renderer=new CatArt.Renderer(canvas),audio=new CatAudio();
let storage;try{storage=localStorage}catch{}
const store=new CatSave.Store(storage),save=store.data,params=new URLSearchParams(location.search);
renderer.c.scale(2,2);
let run=null,mode='menu',acc=0,last=0,toastTime=0,selected=save.selected,daily='',report=null,trainer=null;
let photoDialog=null,flightStyle='classic';
function applySettings(){
 audio.volume=save.settings.mute?0:save.settings.fx;
 audio.music=save.settings.mute?0:save.settings.music;
 renderer.motion=save.settings.motion&&(save.settings.motionOverride||!matchMedia('(prefers-reduced-motion: reduce)').matches);
 $('#sound').textContent=save.settings.mute?'Sound off':'Sound on';
}
function button(text,action,cls='secondary'){const b=document.createElement('button');b.textContent=text;b.className=cls;b.onclick=()=>action();return b}
function show(html){const s=$('#screen');s.className='screen';s.innerHTML='<div class="panel panel-'+mode+'">'+html+'</div>';return s.firstElementChild}
function flightHelp(){return matchMedia('(pointer: coarse)').matches?{flap:'Tap the sky',dash:'Tap ZOOMIES',pause:'Tap the pause button'}:{flap:'Press Space or ↑',dash:'Press X or click ZOOMIES',pause:'Press P to pause'}}
function friendlyHint(text){const h=flightHelp();return text.replaceAll('Tap the sky or press Space / ↑',h.flap).replaceAll('Press X or tap ZOOMIES',h.dash)}
function note(p,text){const n=document.createElement('p');n.textContent=text;p.append(n)}
function menu(){
 mode='menu';run=null;trainer=null;$('#lesson').hidden=true;$('#toast').textContent='';daily='';$('#hud').hidden=true;$('#live-controls').hidden=true;updateCat();
 const p=show('<span class="eyebrow">LET’S HELP YOUR CAT FLY</span><h2>cat-astrophe!</h2><canvas class="home-room" width="600" height="230" role="img" aria-label="Luna, Coco and Pepe together in their cozy room. Choose a flying friend below."></canvas><p>Catch fish. Dodge obstacles. Come home together.</p><div class="meta"><span><b>'+(flightStyle==='relaxed'?save.relaxedBest:save.best)+'</b>'+(flightStyle==='relaxed'?'RELAXED BEST':'CLASSIC BEST')+'</span><span><b>'+save.balance+'</b>FISH BANK</span></div>');
 const choices=document.createElement('div');choices.className='home-choices';choices.setAttribute('role','group');choices.setAttribute('aria-label','Choose your flying friend');
 for(const [id,cat]of Object.entries(ROSTER)){
  const owned=save.unlocked.includes(id),isSelected=selected===id;
  const choose=button(cat.name+(isSelected?' · flying':owned?' · select':' · '+cat.cost+' fish'),()=>{
   if(!owned){collection();return}
   if(store.selectCat(id)){selected=id;menu()}
  });choose.className='home-choice'+(isSelected?' is-selected':'');choose.setAttribute('aria-pressed',String(isSelected));choose.setAttribute('aria-label',owned?cat.name+(isSelected?', selected for flight':', select for flight'):cat.name+', locked. Unlock for '+cat.cost+' fish in Cats');choices.append(choose);
 }
 p.append(choices);
 const styles=document.createElement('div');styles.className='flight-styles';styles.setAttribute('role','group');styles.setAttribute('aria-label','Flight difficulty');
 for(const [id,label]of [['classic','Classic flight'],['relaxed','Relaxed flight']]){const option=button(label,()=>{flightStyle=id;menu()});option.className='flight-style'+(flightStyle===id?' is-selected':'');option.setAttribute('aria-pressed',String(flightStyle===id));styles.append(option)}p.append(styles);
 note(p,flightStyle==='relaxed'?'Relaxed: wide gaps, slower flight, 2 hearts. Local best only; no banked rewards.':'Classic: the original challenge. Earn fish and compete online.');

 p.append(button(save.walkthroughComplete?'Let’s play  →':'Learn to fly  →',save.walkthroughComplete?()=>start(false):startWalkthrough,'play'));
 if(!save.walkthroughComplete)p.append(button('Play now · skip practice',()=>start(false)));
 const row=document.createElement('div');row.className='menu-row';
 row.append(button('Cats',collection),button('Outfits',closet),button('Missions',missions),button('Milestones',milestones),button('Settings',()=>settings(menu)),button('Daily flight',()=>start(true)),button('Walkthrough',startWalkthrough));row.append(button('Our cats',ourCats));if(rootBoard())row.append(button('Global top 100',leaderboard));p.append(row);
 const h=flightHelp();const help=document.createElement('details');help.className='menu-help';const helpTitle=document.createElement('summary');helpTitle.textContent='How to play';help.append(helpTitle);note(help,h.flap+' to go up. Stop to float down.');note(help,h.dash+' when full. '+h.pause+'.');note(help,'Hearts give another chance · carry up to 2');for(const info of Object.values(CatArt.POWERUPS||{}))note(help,info.name+': '+info.hint+'.');p.append(help);const dedication=document.createElement('p');dedication.className='menu-dedication';dedication.textContent='For Luna, Coco, and Pepe. Always close to our hearts.';p.append(dedication);
}
function rootBoard(){return globalThis.CatBoard}
function leaderboard(){mode='leaderboard';const p=show('<span class="eyebrow">THE WORLD’S BIGGEST MENACES</span><h2>Global top 100.</h2>'),scores=document.createElement('div');p.append(button('Classic',()=>CatBoard.list(scores,'classic')),button('Daily',()=>CatBoard.list(scores,'daily')),scores,button('Back',menu));CatBoard.list(scores,'classic')}
function ourCats(){
 mode='stories';const p=show('<span class="eyebrow">THE CATS BEHIND THE ADVENTURE</span><h2>Our cats.</h2><p>For Luna, Coco, and Pepe. This little adventure is for them.</p>');
 note(p,'These are real family stories. They include loss and a cat who went missing. Read them whenever you feel ready.');
 for(const id of Object.keys(ROSTER))p.append(button('Meet '+ROSTER[id].name,()=>catStory(id,ourCats)));
 p.append(button('Back to the game',menu));
}
function catStory(id,back=collection){
 mode='story';const cat=ROSTER[id],story=globalThis.CatStories?.[id];if(!story)return back();
 const p=show('<span class="eyebrow">'+cat.title+'</span><h2>'+cat.name+'</h2>');
 const image=document.createElement('img');image.src=story.photo;image.alt=story.alt;image.className='story-photo';const photoButton=button('',()=>openPhoto(image,photoButton));photoButton.className='story-photo-button';photoButton.setAttribute('aria-label','View full-size photo of '+cat.name);photoButton.append(image);p.append(photoButton);note(p,'Tap the photo to see it full screen.');
 const words=document.createElement('div');words.className='story-words';for(const text of story.paragraphs)note(words,text);p.append(words);
 p.append(button('Back',back));
}
function openPhoto(image,trigger){
 if(photoDialog)return;
 const dialog=document.createElement('dialog');dialog.className='photo-viewer';dialog.setAttribute('aria-label','Full-size cat photo');photoDialog=dialog;
 const close=button('← Back to story · Close',()=>dialog.close());close.className='photo-close';
 const full=document.createElement('img');full.src=image.src;full.alt=image.alt;dialog.append(close,full);
 const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>{photoDialog=null;document.body.style.overflow=previousOverflow;dialog.remove();trigger.focus()},{once:true});
 document.body.append(dialog);dialog.showModal();close.focus();
}
function collection(){
 mode='collection';const p=show('<span class="eyebrow">FISH BANK · '+save.balance+'</span><h2>Choose your<br>flying friend.</h2><canvas class="menu-cat" width="600" height="260"></canvas><div class="roster"></div>');
 for(const [id,cat]of Object.entries(ROSTER)){
  const owned=save.unlocked.includes(id);
  const b=button(cat.name+(owned?selected===id?' · flying':' · select':' · unlock for '+cat.cost+' fish'),()=>{
   if(owned){store.selectCat(id);selected=id;updateCat()}else if(store.buyCat(id))audio.play('unlock');
   collection();
  },selected===id?'selected':'');
  b.disabled=!owned&&save.balance<cat.cost;
  const preview=document.createElement('canvas');preview.className='cat-thumb';preview.dataset.cat=id;preview.width=180;preview.height=140;preview.setAttribute('aria-label',cat.name+' appearance');const copy=document.createElement('span');copy.className='cat-card-copy';const name=document.createElement('span');name.className='cat-card-name';name.textContent=b.textContent;b.textContent='';copy.append(name);b.append(preview,copy);
  const small=document.createElement('small');small.textContent=cat.trait;copy.append(small);const card=document.createElement('div');card.className='cat-card';const meet=button('Meet '+cat.name+' →',()=>catStory(id,collection));meet.className='cat-story-link';card.append(b,meet);p.querySelector('.roster').append(card);
 }
 p.append(button('Back to flight',menu));
}
function updateCat(){
 const c=ROSTER[run?.cat||selected];$('#cat-name').textContent=c.name;$('#cat-tag').textContent=c.title;$('#cat-description').textContent=c.description;
 $('#portrait').setAttribute('aria-label','Animated preview of '+c.name);
}
function closet(){
 mode='closet';const p=show('<span class="eyebrow">'+save.balance+' FISH · '+save.tokens+' YARN TOKENS</span><h2>Dress for<br>the disaster.</h2><canvas class="menu-cat" width="600" height="260"></canvas><div class="roster"></div>');
 for(const [id,label,cost]of [['none','Birthday suit','Free'],['goggles','Aviator goggles','15 fish'],['crown','Cardboard crown','3 yarn tokens']]){
  const owned=save.outfits.includes(id),b=button(label+(owned?' · '+(save.outfit===id?'wearing':'equip'):' · '+cost),()=>{
   if(owned){save.outfit=id;store.write()}else if(store.buyOutfit(id))audio.play('unlock');closet();
  });b.disabled=!owned&&(id==='crown'?save.tokens<3:save.balance<15);p.querySelector('.roster').append(b);
 }p.append(button('Back',menu));
}
function missions(){
 mode='missions';const p=show('<span class="eyebrow">LITTLE GOALS. BIG CAT ENERGY.</span><h2>Flight plans.</h2>');
 for(const m of CatSave.MISSIONS.filter(m=>!save.missions.includes(m.id)).slice(0,3)){
  const d=document.createElement('div');d.className='mission';const n=Math.min(m.goal,save.totals[m.stat]);
  d.innerHTML='<b>'+m.title+'</b><br>'+m.text+'<br>'+n+' / '+m.goal+' · reward '+m.reward+' fish<progress value="'+n+'" max="'+m.goal+'"></progress>';p.append(d);
 }
 if(save.missions.length===CatSave.MISSIONS.length)note(p,'All missions complete. An accomplished menace.');
 note(p,save.missions.length+' missions complete · '+save.achievements.length+' achievements');
 if(save.achievements.length)note(p,save.achievements.map(a=>CatSave.MILESTONES.find(m=>m.id===a)?.title||a.replaceAll('-',' ')).join(' · '));
 note(p,'Daily best: '+(save.daily[CatSave.dailyKey()]||0));p.append(button('Back',menu));
}
function milestones(section='badges',page=0){
 mode='milestones';const p=show('<span class="eyebrow">YOUR LITTLE VICTORIES</span><h2>Look how far<br>you’ve flown.</h2>');
 const tabs=document.createElement('div');tabs.className='milestone-tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Progress collection');
 for(const [id,label] of [['badges','Badges'],['discoveries','Keepsakes']]){const b=button(label,()=>milestones(id));b.setAttribute('aria-pressed',String(section===id));tabs.append(b)}p.append(tabs);
 if(section==='badges'){
 note(p,'Classic and Daily flights count. Each badge celebrates a little victory.');
 for(const m of CatSave.MILESTONES.slice(page*3,page*3+3)){const earned=save.achievements.includes(m.id),value=CatSave.milestoneProgress(save,m),card=document.createElement('div');card.className='milestone-card'+(earned?' earned':'');
 const title=document.createElement('b');title.textContent=(earned?'✓ ':'')+m.title;card.append(title);note(card,m.text);
 const status=document.createElement('span');status.textContent=earned?'Badge earned':value+' / '+m.goal;card.append(status);
 const progress=document.createElement('progress');progress.max=m.goal;progress.value=value;progress.setAttribute('aria-label',m.title+' progress');card.append(progress);p.append(card)}
 const pages=Math.ceil(CatSave.MILESTONES.length/3),nav=document.createElement('div');nav.className='milestone-pages';
 const previous=button('Previous',()=>milestones('badges',page-1));previous.disabled=page===0;nav.append(previous);
 const status=document.createElement('span');status.textContent=(page+1)+' / '+pages;status.setAttribute('aria-label','Badge page '+(page+1)+' of '+pages);nav.append(status);
 const next=button('Next',()=>milestones('badges',page+1));next.disabled=page===pages-1;nav.append(next);p.append(nav);
 }
 if(section==='discoveries'&&globalThis.CatDiscovery){const title=document.createElement('h3');title.textContent='Relaxed discoveries';p.append(title);note(p,'Optional star trails save keepsakes, not points. Fly with each cat to find theirs.');for(const memory of Object.values(CatDiscovery.MEMORIES)){const card=document.createElement('div');card.className='milestone-card';note(card,(save.discoveries.includes(memory.id)?'✓ Found: ':'Not found yet: ')+memory.title);p.append(card)}}
 p.append(button('Back',menu));
}
function settings(back){
 mode='settings';const p=show('<span class="eyebrow">ADJUST THE CHAOS</span><h2>Creature comforts.</h2>');
 for(const [key,label]of [['fx','Sound effects'],['music','Music']]){
  const l=document.createElement('label');l.className='setting';l.textContent=label;
  const input=document.createElement('input');input.type='range';input.min=0;input.max=1;input.step=.05;input.value=save.settings[key];
  input.oninput=()=>{save.settings[key]=+input.value;applySettings();store.write()};l.append(input);p.append(l);
 }
 for(const [key,label]of [['mute','Mute all audio'],['motion','Animations (fans, wings and cat movement)']]){
  const l=document.createElement('label');l.className='setting';const input=document.createElement('input');input.type='checkbox';input.checked=key==='motion'?renderer.motion:save.settings[key];
  input.onchange=()=>{save.settings[key]=input.checked;if(key==='motion')save.settings.motionOverride=true;applySettings();store.write()};l.append(input,' '+label);p.append(l);
 }
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)note(p,'Your device prefers less motion. Turn Animations on above if you would like fans, wings and cats to move.');
 p.append(button('Use device motion preference',()=>{save.settings.motion=true;save.settings.motionOverride=false;applySettings();store.write();settings(back)}));
 if(!store.available)note(p,'Browser storage is unavailable. Progress lasts for this session.');
 p.append(button('Back',back));if(params.has('dev'))p.append(button('Flight lab',lab));
}
function start(isDaily=!!daily,practice=false){
 trainer=null;$('#lesson').hidden=true;$('#toast').textContent='';
 audio.init();daily=isDaily?CatSave.dailyKey():'';
 const seed=params.has('seed')?Number(params.get('seed'))>>>0:Date.now()>>>0;
 run=new Run(daily?CatSave.dailySeed(daily):seed,daily?'biscuit':selected,{mode:!daily&&!practice?flightStyle:'classic'});
 if(rootBoard()&&run.mode!=='relaxed'&&!practice&&!params.has('dev'))run.onlineTicket=CatBoard.ticket(daily?'daily':'classic');
 run.outfit=save.outfit;report=null;mode='playing';acc=0;last=0;toastTime=0;
 $('#screen').className='screen empty';$('#hud').hidden=false;$('#live-controls').hidden=false;
 renderer.particles=[];run.flap();updateCat();canvas.focus();
}
function startWalkthrough(){
 start(false,true);run=new Run(17,'biscuit');run.outfit=save.outfit;trainer=new CatTraining.Walkthrough(run);
 $('#lesson').hidden=false;updateCat();canvas.focus();updateLesson();
}
function updateLesson(){
 if(!trainer)return;const step=CatTraining.STEPS[trainer.stage];
 $('#lesson-title').textContent=step?.title||'CLEARED FOR TAKEOFF';
 $('#lesson-text').textContent=friendlyHint(trainer.hint);
 $('#lesson-progress').textContent=trainer.stage===0?Math.min(run.flaps,3)+' / 3 flaps':trainer.stage===1?Math.min(run.fish,3)+' / 3 fish':trainer.stage===2?flightHelp().dash:'Stay away from the dotted line';
}
function graduated(){
 save.walkthroughComplete=true;store.write();run.state='complete';mode='tutorial-done';
 $('#lesson').hidden=true;$('#live-controls').hidden=true;
 const p=show('<span class="eyebrow">WALKTHROUGH COMPLETE</span><h2>You’re ready<br>to fly!</h2><p>Great job! You can fly, catch fish, dash, and dodge.<br>Fish from your next flight go into your fish bank.</p>');
 p.append(button('My first real flight  →',()=>start(false),'play'),button('Practice again',startWalkthrough),button('Main menu',menu));
}
function pausedMenu(){
 mode='paused';const p=show('<span class="eyebrow">TAKE A LITTLE BREAK</span><h2>Flight paused.</h2><p>Your cat will wait. Keep flying whenever you’re ready!</p>');
 p.append(button('Resume flight',resume,'play'),button('Restart',()=>{if(run.tutorial)startWalkthrough();else start()}),button('Settings',()=>settings(pausedMenu)),button('Main menu',menu));
}
function pause(){
 if(!run||!['playing','paused'].includes(run.state))return;
 if(run.state==='paused'){if(mode==='paused')resume();else pausedMenu();return}
 run.pause();pausedMenu();
}
function resume(){if(!run)return;run.state='playing';$('#screen').className='screen empty';mode='playing';acc=0;last=0;canvas.focus()}
function over(){
 mode='over';report=store.settle(run,daily);$('#live-controls').hidden=true;if(report?.newBest||report?.milestones?.length)audio.play('unlock');
 const names={ground:'A little tumble! Try a few small flaps.',ceiling:'A little too high! Let your cat float down.',laundry:'Watch out for the laundry next time!',pigeon:'Watch the dotted line to dodge pigeons.',vacuum:'Fly through the open gap to dodge the vacuum.',toast:'Watch out for the toast! Try again.',fan:'Give the fan a little more space.',yarn:'Caught in yarn! Tap three times to get free.'};
 const p=show('<span class="eyebrow">'+(run.lab?'LAB FLIGHT · NO REWARDS':run.mode==='relaxed'?'RELAXED FLIGHT · LOCAL BEST ONLY':daily?'DAILY FLIGHT · '+daily:'FLIGHT REPORT')+'</span><h2>'+(report?.newBest?'A new record!':'Nice try!')+'</h2><p>'+names[run.death]+'</p><div class="result-grid"><div><b>'+run.score+'</b>SCORE</div><div><b>'+(run.mode==='relaxed'?save.relaxedBest:save.best)+'</b>BEST</div><div><b>'+run.fish+'</b>FISH '+(run.lab||run.mode==='relaxed'?'CAUGHT':'SAVED')+'</div><div><b>'+run.near+' / '+run.bestCombo+'×</b>NEAR MISSES / COMBO</div></div><details class="flight-details"><summary>Flight details &amp; cat adventure</summary><p>'+run.passed+' obstacles passed. Keep practicing—you’ve got this!<br>Distance '+(run.stats.distance||0)+' · Passes '+run.stats.pass+' · Fish '+run.stats.fish+'<br>Dodges '+run.stats.near+' · Worlds '+run.stats.world+' · Events '+(run.stats.event||0)+' · Mischief '+(run.stats.mischief||0)+'<br>'+run.escapes+' tangles escaped · '+run.blocks+' boxes sacrificed.</p></details>');
 const details=p.querySelector('.flight-details');
 if(run.discoveries?.found.length)for(const id of run.discoveries.found){const memory=Object.values(CatDiscovery.MEMORIES).find(m=>m.id===id);if(memory)note(details,'Discovery: '+memory.title+' · saved as a keepsake')}
 if(report?.milestones?.length){const badge=document.createElement('div');badge.className='milestone-banner';badge.setAttribute('role','status');badge.textContent='New badge: '+report.milestones[0].title+(report.milestones.length>1?' +'+(report.milestones.length-1)+' more':'');p.append(badge);for(const m of report.milestones)note(details,'Badge earned: '+m.title+' · '+m.text)}
 if(run.mischief){
  const m=run.mischief.counts,parts=[];
  if(m.pots)parts.push(m.pots+' flowerpot'+(m.pots===1?'':'s')+' smashed');
  if(m.toast)parts.push(m.toast+' toast'+(m.toast===1?'':'s')+' stolen');
  if(m.bells)parts.push(m.bells+' bell'+(m.bells===1?'':'s')+' rung');
  if(m.pigeons)parts.push(m.pigeons+' pigeon'+(m.pigeons===1?'':'s')+' outsmarted');
  const crime=document.createElement('div');crime.className='crime-report';
  crime.innerHTML='<b>YOUR CAT ADVENTURE</b>';const text=document.createElement('p');text.textContent=parts.length?parts.join(' · '):'A peaceful flight. Try a Zoomies dash next time!';crime.append(text);details.append(crime);
  note(details,'Mischief bonus: '+(run.stats.mischief||0)+' points');
 }
 if(run.mode==='relaxed')note(p,'Relaxed best is saved on this device. Fish and missions stay in Classic or Daily.');
 if(report?.completed.length)note(p,report.completed.map(m=>'Mission: '+m.title+' (+'+m.reward+' fish)').join(' · '));
 if(rootBoard()&&run.mode!=='relaxed'&&!run.lab&&!run.tutorial&&!params.has('dev'))CatBoard.mount(p,run,daily?'daily':'classic');
 p.append(button('Again. For science.  →',()=>start(),'play'),button('Main menu',menu));
}
function lab(){
 mode='lab';const p=show('<span class="eyebrow">DEVELOPER FLIGHT LAB · NO REWARDS</span><h2>Reproduce it.</h2><p>Controlled scenarios use the live simulation.</p>');
 for(const scenario of ['near','yarn','box','magnet','nip','rescue','dream','kitchen','vacuum','mischief']){
  p.append(button(scenario,()=>{
   start(false);run.lab=true;run.next=1000;run.gates=[];run.items=[];run.vy=0;
   if(scenario==='near')run.gates=[{id:0,x:C.x-68,center:428,gap:208,type:'laundry',age:0}];
   if(scenario==='yarn')run.recover({type:'yarn'});
   if(scenario==='box'){run.armor=8;run.recover({type:'toast',center:350,gap:200})}
   if(scenario==='magnet'){run.magnet=7;run.items=[{x:C.x+90,y:run.y,kind:'gold'}]}
   if(scenario==='nip')run.collect({kind:'nip'});
   if(scenario==='rescue'){run.rescues=1;run.y=655}
   if(scenario==='dream')run.world=2;
   if(scenario==='kitchen')run.world=1;
   if(scenario==='mischief'){run.charge=100;run.mischief.add('pot',C.x+85,run.y-25)}
   if(scenario==='vacuum'){run.world=1;run.next=0;run.beginEncounter()}
  }));
 }p.append(button('Back',menu));
}
function flap(){if(mode==='playing')run.flap()}
canvas.addEventListener('pointerdown',e=>{e.preventDefault();flap()});
document.addEventListener('keydown',e=>{
 if(photoDialog){if(e.code==='Escape'){e.preventDefault();photoDialog.close()}return}

 // Native form controls own their keys, including sliders and editable descendants.
 if(e.target.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"]),[role="slider"]'))return;
 if(e.target.closest('button,a')&&['Space','ArrowUp'].includes(e.code))return;
 if(['Space','ArrowUp'].includes(e.code)&&['playing','menu','over'].includes(mode)){e.preventDefault();if(e.repeat)return;if(mode==='playing')flap();else if(mode==='menu'){if(save.walkthroughComplete)start();else startWalkthrough()}else if(mode==='over')start()}
 if(e.code==='KeyP'||e.code==='Escape'){e.preventDefault();pause()}
 if(e.code==='KeyX'&&mode==='playing')run.ability();
 if(e.code==='KeyD'&&params.has('dev'))renderer.debug=!renderer.debug;
});
$('#ability').onclick=()=>{if(mode==='playing'){run.ability();canvas.focus()}};
$('#pause').onclick=pause;
$('#skip-lesson').onclick=()=>start(false);
$('.brand').onclick=e=>{e.preventDefault();menu()};
$('#sound').onclick=()=>{audio.init();save.settings.mute=!save.settings.mute;applySettings();store.write()};
window.addEventListener('storage',e=>{if(e.key!=='catastrophe-v1')return;store.sync();selected=save.selected;applySettings();if(mode==='menu')menu();else if(mode==='collection')collection();else if(mode==='closet')closet();else if(mode==='missions')missions();else if(mode==='milestones')milestones()});
window.addEventListener('blur',()=>{if(mode==='playing')pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause()});
function frame(ms){
 const elapsed=last?Math.max(0,(ms-last)/1000):0;last=ms;
 // Catch up ordinary slow frames; a long stall requires a deliberate resume.
 if(elapsed>.5&&mode==='playing')pause();
 const dt=Math.min(.5,elapsed);
 if(mode==='playing'){
  acc+=dt;while(acc>=1/120&&run.state==='playing'){run.step(1/120);trainer?.step(1/120);acc-=1/120;if(trainer?.complete){graduated();break}}
  for(const e of run.drain()){
   audio.play(e.type);if(e.type==='fish'||e.type==='mischief')renderer.burst(e.x??C.x,e.y??run.y,e.type);
   if(e.type==='near'||e.type==='rescue')renderer.burst(C.x,run.y,e.type);
   if(e.text){$('#toast').textContent=e.text;toastTime=e.type==='warning'?2.5:2}
   if(e.type==='over')over();
  }
  if(trainer&&mode==='playing')updateLesson();
  $('#score').textContent=run.score;$('#fish').textContent=run.fish;
 }
 $('#pause').disabled=!run||!['playing','paused'].includes(run.state);
 if(run){
  $('#charge').textContent=Math.floor(run.charge)+'%';
  $('#ability').disabled=mode!=='playing'||run.charge<(run.cat==='pounce'?65:100)||run.cooldown>0;
  $('#ability').firstChild.textContent=run.cat==='pounce'?'POUNCE ':'ZOOMIES ';
  $('#effects').textContent=[run.mode==='relaxed'?'RELAXED':'',run.armor>0?'BOX '+Math.ceil(run.armor)+'s':'',run.magnet>0?'MAGNET '+Math.ceil(run.magnet)+'s':'',run.nip>0?'CATNIP '+Math.ceil(run.nip)+'s':'','♥ '+run.rescues+' / 2',run.combo?'DODGE ×'+run.combo:''].filter(Boolean).join(' · ');
 }
 $('#lesson').hidden=!(trainer&&mode==='playing');
 toastTime=Math.max(0,toastTime-dt);$('#toast').classList.toggle('show',toastTime>0&&mode==='playing'&&!run?.tutorial);
 renderer.draw(run,ms/1000,mode==='playing'?dt:0);audio.update?.(dt,run?.world||0,mode==='playing');
 const t=renderer.motion?ms/1000:0,c=$('#portrait').getContext('2d');
 c.clearRect(0,0,360,260);c.save();c.translate(180,140);c.scale(2.3,2.3);CatArt.cat(c,0,Math.sin(t*2)*3,t,run?.cat||selected,'curious',1,0,save.outfit,{motion:renderer.motion,idle:true});c.restore();
 const room=$('.home-room');if(room)CatArt.home(room.getContext('2d'),t,selected,renderer.motion,save.outfit);
 const mc=$('.menu-cat');if(mc){const m=mc.getContext('2d');m.clearRect(0,0,600,260);m.save();m.translate(300,140);m.scale(2.4,2.4);CatArt.cat(m,0,Math.sin(t*2)*4,t,selected,'curious',1,0,save.outfit,{motion:renderer.motion,idle:true});m.restore()}
 for(const thumb of document.querySelectorAll('.cat-thumb')){const c=thumb.getContext('2d');c.clearRect(0,0,180,140);c.save();c.translate(94,78);c.scale(1.5,1.5);CatArt.cat(c,0,Math.sin(t*2)*2,t,thumb.dataset.cat,'curious',1,0,save.outfit,{motion:renderer.motion,idle:true});c.restore()}
 requestAnimationFrame(frame);
}
applySettings();updateCat();menu();requestAnimationFrame(frame);
})();
