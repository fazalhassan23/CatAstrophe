/* Versioned local progression; invalid fields discarded independently. */
(function(root){
const {ROSTER}=CatCore,KEY='catastrophe-v1';
const defaults=()=>({version:1,walkthroughComplete:false,best:0,relaxedBest:0,balance:0,tokens:0,unlocked:['biscuit'],outfits:['none'],selected:'biscuit',outfit:'none',totals:{fish:0,near:0,worlds:0,escapes:0,dashes:0,runs:0},missions:[],achievements:[],daily:{},settings:{fx:.45,music:.12,mute:false,motion:true}});
const num=(n,max=1e9)=>typeof n==='number'&&Number.isFinite(n)?Math.min(max,Math.max(0,n)):0;
function normalize(v){const d=defaults();if(!v||typeof v!=='object')return d;d.walkthroughComplete=v.walkthroughComplete===true;for(const k of ['best','relaxedBest','balance','tokens'])d[k]=Math.floor(num(v[k]));d.unlocked=[...new Set(['biscuit',...(Array.isArray(v.unlocked)?v.unlocked:[]).filter(k=>ROSTER[k])])];d.outfits=[...new Set(['none',...(Array.isArray(v.outfits)?v.outfits:[]).filter(k=>['goggles','crown'].includes(k))])];if(d.unlocked.includes(v.selected))d.selected=v.selected;if(d.outfits.includes(v.outfit))d.outfit=v.outfit;for(const k of Object.keys(d.totals))d.totals[k]=Math.floor(num(v.totals?.[k]));d.missions=Array.isArray(v.missions)?v.missions.filter(k=>typeof k==='string'):[];d.achievements=Array.isArray(v.achievements)?v.achievements.filter(k=>typeof k==='string'):[];if(v.settings){for(const k of ['fx','music'])if(typeof v.settings[k]==='number')d.settings[k]=num(v.settings[k],1);for(const k of ['mute','motion'])if(typeof v.settings[k]==='boolean')d.settings[k]=v.settings[k]}if(v.daily&&typeof v.daily==='object')for(const [k,n]of Object.entries(v.daily).slice(-30))if(/^\d{4}-\d{2}-\d{2}$/.test(k))d.daily[k]=Math.floor(num(n));return d}
const MISSIONS=[{id:'fish',title:'A decent lunch',text:'Collect 15 fish across flights.',goal:15,stat:'fish',reward:10},{id:'near',title:'Living on the edge',text:'Make 3 successful near misses.',goal:3,stat:'near',reward:15},{id:'worlds',title:'Wrong turn at the sky',text:'Discover the Kitchen Dimension.',goal:1,stat:'worlds',reward:15},{id:'escapes',title:'Unbe-weave-able',text:'Escape one yarn tangle.',goal:1,stat:'escapes',reward:8},{id:'dashes',title:'Unscheduled acceleration',text:'Activate Zoomies or Pounce 3 times.',goal:3,stat:'dashes',reward:15}];
class Store{
 constructor(storage){this.storage=storage;this.credited=new WeakSet();this.available=!!storage;try{this.data=normalize(JSON.parse(storage?.getItem(KEY)||'null'))}catch{this.data=defaults()}this.baseline=structuredClone(this.data)}
 sync(){
  if(!this.storage)return;
  try{
   const raw=this.storage.getItem(KEY);if(!raw)return;
   const latest=normalize(JSON.parse(raw)),local=this.data,base=this.baseline;
   // Rebase local changes onto current storage. Currency changes include spending.
   for(const k of ['balance','tokens'])latest[k]=Math.max(0,latest[k]+local[k]-base[k]);
   latest.best=Math.max(latest.best,local.best);latest.relaxedBest=Math.max(latest.relaxedBest,local.relaxedBest);
   for(const k of ['unlocked','outfits','missions','achievements'])latest[k]=[...new Set([...latest[k],...local[k]])];
   for(const k of Object.keys(latest.totals))latest.totals[k]+=Math.max(0,local.totals[k]-base.totals[k]);
   for(const [k,v]of Object.entries(local.daily))latest.daily[k]=Math.max(latest.daily[k]||0,v);
   latest.walkthroughComplete ||= local.walkthroughComplete;
   for(const k of ['selected','outfit'])if(local[k]!==base[k])latest[k]=local[k];
   for(const k of Object.keys(latest.settings))if(local.settings[k]!==base.settings[k])latest.settings[k]=local.settings[k];
   Object.assign(local,latest);this.baseline=normalize(JSON.parse(raw));
  }catch{this.available=false}
 }
 write(){this.sync();try{this.storage?.setItem(KEY,JSON.stringify(this.data));this.baseline=structuredClone(this.data)}catch{this.available=false}}
 buyCat(id){this.sync();const c=ROSTER[id],d=this.data;if(!c||d.unlocked.includes(id)||d.balance<c.cost)return false;d.balance-=c.cost;d.unlocked.push(id);this.write();return true}
 selectCat(id){this.sync();if(!this.data.unlocked.includes(id))return false;this.data.selected=id;this.write();return true}
 buyOutfit(id){this.sync();const d=this.data;if(d.outfits.includes(id)||!['goggles','crown'].includes(id))return false;const currency=id==='crown'?'tokens':'balance',cost=id==='crown'?3:15;if(d[currency]<cost)return false;d[currency]-=cost;d.outfits.push(id);d.outfit=id;this.write();return true}
 settle(run,daily=''){if(run.lab||run.tutorial||run.state!=='over'||this.credited.has(run))return null;this.credited.add(run);this.sync();const d=this.data;if(run.mode==='relaxed'){const newBest=run.score>d.relaxedBest;d.relaxedBest=Math.max(d.relaxedBest,run.score);this.write();return{newBest,completed:[],relaxed:true}}const newBest=run.score>d.best;d.best=Math.max(d.best,run.score);d.balance+=run.fish;d.tokens+=run.tokens;d.totals.runs++;d.totals.fish+=run.fish;d.totals.near+=run.near;d.totals.worlds+=Math.floor(run.passed/6);d.totals.escapes+=run.escapes;d.totals.dashes+=run.dashes;const completed=[];for(const m of MISSIONS)if(!d.missions.includes(m.id)&&d.totals[m.stat]>=m.goal){d.missions.push(m.id);d.balance+=m.reward;completed.push(m)}for(const [id,yes]of [['first-flight',true],['minute-menace',run.time>=60],['combo-three',run.bestCombo>=3],['world-tour',run.passed>=12],['no-rescue',run.passed>=6&&run.usedRescues===0]])if(yes&&!d.achievements.includes(id))d.achievements.push(id);if(daily)d.daily[daily]=Math.max(d.daily[daily]||0,run.score);this.write();return{newBest,completed}}
}
function dailyKey(){return new Date().toISOString().slice(0,10)}
function dailySeed(key){return [...key].reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261)}
root.CatSave={Store,normalize,defaults,MISSIONS,dailyKey,dailySeed};if(typeof module!=='undefined')module.exports=root.CatSave;
})(globalThis);
