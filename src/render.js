(function(root){
const {C,clamp}=CatCore;
const palettes=[{sky:'#bce9e5',light:'#f5f6df',building:'#c5d6c1',front:'#8fb9aa',accent:'#ed8d64',name:'The Neighborhood'}, {sky:'#f9d6b1',light:'#fff3d8',building:'#dcb49b',front:'#bf8978',accent:'#93c6b3',name:'Kitchen Dimension'},{sky:'#34365b',light:'#aba6db',building:'#555179',front:'#69618b',accent:'#d39ad4',name:"The Cat’s Dream"}];
function rr(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=2.5;c.stroke()}}
function ellipse(c,x,y,rx,ry,fill,stroke){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2.5;c.stroke()}}
function path(c,points,fill,stroke){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=2.5;c.stroke()}}
function line(c,points,color,width=2){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke()}
function fish(c,x,y,gold=false,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);path(c,[[-8,0],[-19,-9],[-19,9]],gold?'#e8ac39':'#ea8d79','#704c45');ellipse(c,0,0,12,8,gold?'#ffcf5a':'#f4a98b','#704c45');ellipse(c,5,-2,1.8,1.8,'#263e3d');line(c,[[-3,-5],[-3,5]],'#fff1cc',2);c.restore()}
function cat(c,x,y,t=0,id='biscuit',mood='curious',flap=0,rotation=0,outfit='none'){
 const ink='#493e3a',coat=id==='mochi'?'#fff4de':id==='pounce'?'#586371':'#eaa369',light=id==='pounce'?'#ece9dc':'#fff0cf';
 c.save();c.translate(x,y);c.rotate(rotation);const bounce=Math.max(0,1-flap*5);c.scale(1+bounce*.1,1-bounce*.07);
 // A separate articulated tail, four paws, ears, head, eyes and costume.
 c.save();c.rotate(Math.sin(t*5)*.15);line(c,[[-18,7],[-38,8],[-48,-1],[-45,-13]],ink,id==='mochi'?17:13);line(c,[[-18,7],[-38,8],[-48,-1],[-45,-13]],coat,id==='mochi'?12:8);c.restore();
 const paw=Math.sin(t*10+flap*14)*9;
 ellipse(c,-14,23+paw,8,12,coat,ink);ellipse(c,14,23-paw,8,12,coat,ink);
 ellipse(c,-2,5,id==='mochi'?32:27,id==='mochi'?28:24,coat,ink);ellipse(c,4,10,15,15,light);
 if(id==='mochi'){for(let i=0;i<8;i++){const a=i*Math.PI/4;ellipse(c,Math.cos(a)*25,Math.sin(a)*21,9,9,coat)}}
 path(c,[[-21,-12],[-25,-40],[-5,-26]],coat,ink);path(c,[[8,-26],[28,-38],[26,-7]],coat,ink);
 path(c,[[-19,-22],[-21,-33],[-11,-26]],'#e69b94');path(c,[[15,-25],[24,-32],[23,-20]],'#e69b94');
 ellipse(c,4,-10,29,24,coat,ink);ellipse(c,7,1,18,11,light);
 if(id==='biscuit'){line(c,[[-6,-32],[-3,-23]],'#b87549',3);line(c,[[4,-33],[6,-24]],'#b87549',3);line(c,[[15,-30],[14,-22]],'#b87549',3)}
 const sleepy=mood==='sleepy',happy=mood==='excited'||mood==='proud';
 if(sleepy||happy){line(c,[[-9,-9],[-4,happy?-13:-7],[1,-9]],ink,2.5);line(c,[[13,-9],[18,happy?-13:-7],[23,-9]],ink,2.5)}
 else{ellipse(c,-4,-10,mood==='spooked'?5:3.8,mood==='spooked'?7:5.5,ink);ellipse(c,18,-10,mood==='spooked'?5:3.8,mood==='spooked'?7:5.5,ink);ellipse(c,-3,-12,1.3,1.7,'#fff');ellipse(c,19,-12,1.3,1.7,'#fff')}
 path(c,[[4,-2],[11,-2],[7,2]],'#b76b6b');line(c,[[7,3],[7,5],[3,7]],ink,1.7);line(c,[[7,5],[11,7]],ink,1.7);
 for(let s of [-1,1])for(let j=0;j<2;j++)line(c,[[7+s*16,1+j*4],[7+s*32,-1+j*8]],ink,1.5);
 if(id==='pounce'){path(c,[[-7,15],[3,20],[-7,26]],'#ed8574',ink);path(c,[[15,15],[5,20],[15,26]],'#ed8574',ink);ellipse(c,4,20,3,3,'#f9d482')}
 if(outfit==='goggles'){rr(c,-15,-20,17,15,5,'#adcfcc',ink);rr(c,11,-20,17,15,5,'#adcfcc',ink);line(c,[[2,-13],[11,-13]],ink,3)}
 if(outfit==='crown')path(c,[[-14,-31],[-18,-48],[-6,-41],[2,-53],[10,-41],[22,-49],[19,-30]],'#efc766',ink);
 c.restore();
}
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
  if(run?.encounter>0){rr(c,350,85,110,120,27,'#997484','#604b68');rr(c,363,105,70,29,11,'#f3ceb0','#604b68');ellipse(c,382,117,6,6,'#493e3a');ellipse(c,417,117,6,6,'#493e3a');for(let i=0;i<4;i++)line(c,[[370,151+i*10],[438,151+i*10]],'#604b68',4);c.font='bold 11px Arial';c.fillStyle='#604b68';c.fillText('SUCK-O-MATIC',340,70);c.fillText(Math.ceil(run.encounter)+'s',390,222)}
  if(run){for(const g of run.gates)this.obstacle(g,t,run);for(const f of run.items)this.item(f,t);this.mischief(run,t)}
  c.fillStyle=p.front;c.fillRect(0,C.floor,450,60);line(c,[[0,C.floor],[450,C.floor]],'#5a8277',3);
  for(let i=0;i<17;i++){const x=((i*35-distance*.6)%595+595)%595;line(c,[[x,C.floor+10],[x+10,C.floor+10]],'#d8e5c3',3)}
  const y=run?run.y:330+Math.sin(t*2)*8;
  if(run?.dash>0){c.fillStyle='#fff4c780';for(let i=1;i<5;i++)ellipse(c,C.x-i*22,y,24-i*3,14-i*2,'#fff4c780')}
  if(run?.armor>0){c.save();c.translate(C.x,y);c.rotate(Math.sin(t*5)*.09);rr(c,-33,-23,66,47,6,'#c99865','#75553f');line(c,[[-32,-20],[-45,-30],[-17,-31]],'#75553f',3);c.restore()}
  // Reduced motion uses a steady protection ring and never hides the character.
  if(!this.motion&&run?.invuln>0){c.save();c.strokeStyle='#527f75';c.lineWidth=2.5;c.beginPath();c.arc(C.x,y,43,0,Math.PI*2);c.stroke();c.restore()}
  if(!this.motion||!run||run.invuln<=0||Math.sin(t*30)>0)cat(c,C.x,y,t,run?.cat||'biscuit',run?.mood||'curious',run?.flapAge||1,run?.tangle>0?Math.sin(t*8)*.45:clamp((run?.vy||0)/900,-.3,.55),run?.outfit||'none');
  if(run?.tangle>0){ellipse(c,C.x,y+12,29,19,'#bda1d080','#825e9e');for(let i=0;i<4;i++)line(c,[[C.x-26,y-8+i*8],[C.x+27,y+15-i*4]],'#825e9e',2)}
  if(run?.nip>0){for(let i=0;i<5;i++){const a=t*4+i*1.25;ellipse(c,C.x+Math.cos(a)*40,y+Math.sin(a)*32,2.5,2.5,'#fff3ac')}}
  if(run?.magnet>0){c.save();c.setLineDash([3,8]);c.strokeStyle='#fcf0c199';c.lineWidth=1.5;c.beginPath();c.arc(C.x,y,55+Math.sin(t*4)*5,0,7);c.stroke();c.restore()}
  for(const a of this.particles){a.life-=dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=150*dt;c.globalAlpha=Math.max(0,a.life/.6);ellipse(c,a.x,a.y,3,3,a.kind==='near'?'#fff3bd':'#ed9e6e');if(a.kind==='near'){ellipse(c,a.x-4,a.y-4,1.5,1.5,'#fff3bd');ellipse(c,a.x+4,a.y-4,1.5,1.5,'#fff3bd')}}c.globalAlpha=1;this.particles=this.particles.filter(a=>a.life>0);
  if(this.debug&&run){c.strokeStyle='#e94765';c.beginPath();c.arc(C.x,run.y,C.r,0,7);c.stroke();for(const g of run.gates){for(const r of run.shapes(g))c.strokeRect(r.x,r.y,r.w,r.h);c.strokeStyle='#268c72';c.strokeRect(g.x,g.center-g.gap/2,90,g.gap);c.strokeStyle='#e94765'}}
 }
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
   path(c,[[-30,-9],[-40,-4],[-29,-1]],'#d6aa6e');ellipse(c,-23,-12,2,2,'#273e3a');line(c,[[-3,-3],[9,-15-Math.sin(t*18)*7],[15,0]],'#577c89',4);
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
  if(g.type==='pigeon'){c.save();c.setLineDash([4,6]);line(c,[[x-80,y+24],[x+150,y+24]],'#7f8f93',1.5);c.restore();ellipse(c,x+34,y+22,27,17,'#8f9ea9','#4f6269');ellipse(c,x+53,y+9,14,12,'#97b4b3','#4f6269');path(c,[[x+65,y+10],[x+77,y+15],[x+65,y+18]],'#dca36a');ellipse(c,x+56,y+6,2,2,'#263e3d');line(c,[[x+23,y+15],[x+34,y+30],[x+44,y+18]],'#5f7c88',3)}
  if(g.type==='vacuum'){rr(c,x,y,w,h,15,'#b48591','#6b5166');rr(c,x+10,y+12,w-20,30,8,'#e8c5b2','#6b5166');for(let j=0;j<3;j++)line(c,[[x+14,y+54+j*8],[x+w-14,y+54+j*8]],'#6b5166',3);if(k===1){c.save();c.globalAlpha=.35;path(c,[[x,y],[x-80,y-90],[x+w+80,y-90],[x+w,y]],'#fff8dd');c.restore();for(let j=0;j<3;j++)line(c,[[x-30+j*38,y-60],[x+10+j*14,y-20]],'#faf1d3',2)}}
  if(g.type==='toast'){if(k===2){rr(c,x,y,w,h,10,'#9da9a5','#647c78');continue}rr(c,x,y,w,h,13,'#b6774e','#775139');rr(c,x+5,y+5,w-10,h-10,10,'#f4d49e');rr(c,x+19,y+23,18,13,4,'#f7e2a2')}
  if(g.type==='fan'){const cx=x+w/2,cy=y+h/2;ellipse(c,cx,cy,40,40,'#d6ded080','#657e76');c.save();c.translate(cx,cy);c.rotate(t*3);for(let j=0;j<4;j++){c.rotate(Math.PI/2);ellipse(c,0,-19,9,19,'#8eafa1','#657e76')}c.restore();ellipse(c,cx,cy,8,8,'#f2dab0','#657e76');if(k===1)for(let j=0;j<3;j++)line(c,[[cx-20+j*20,cy-67],[cx-15+j*20,cy-100]],'#fff3ca',2)}
  if(g.type==='yarn'){ellipse(c,x+w/2,y+h/2,w/2,h/2,'#b19ac8','#785c92');for(let j=0;j<4;j++)line(c,[[x+8,y+12+j*8],[x+w-8,y+h-12-j*8]],'#e0cde9',2)}
 }
 }
}
root.CatArt={Renderer,cat,fish,rr,palettes};
})(globalThis);
