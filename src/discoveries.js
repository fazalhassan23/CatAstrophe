/* Optional Relaxed trails: no damage, currency, charge, score or course RNG. */
(function(root){
const {C,pickupTouches}=CatCore;
const MEMORIES={biscuit:{id:'luna-trail',title:'Luna’s butterfly trail',text:'A playful little detour for Luna.'},mochi:{id:'coco-trail',title:'Coco’s cloud trail',text:'A gentle path through the clouds.'},pounce:{id:'pepe-trail',title:'Pepe’s cozy hideaway',text:'A little adventure, with home never far away.'}};
class System{
 constructor(run){this.run=run;this.trails=[];this.found=[]}
 spawn(g){const r=this.run;if(r.mode!=='relaxed'||r.tutorial||r.lab||r.encounter>0||g.id<3||g.id%4!==3)return;
 const side=g.id%8===3?-1:1;
 this.trails.push({id:g.id,points:[0,1,2].map(i=>({x:g.x-145+i*38,y:g.center+side*(i===1?40:20),taken:false})),done:false});
 r.emit('discovery-hint',{text:'Optional star trail! Catch all 3 stars, or keep flying.'});
 }
 step(dt,dx,previousY=this.run.y){const r=this.run;if(r.state!=='playing')return;
 for(const trail of this.trails){for(const point of trail.points){const oldX=point.x;point.x-=dx;if(!point.taken&&pickupTouches(oldX,point.y,point.x,point.y,previousY,r.y,'star'))point.taken=true}
 if(!trail.done&&trail.points.every(p=>p.taken)){trail.done=true;const memory=MEMORIES[r.cat];if(!this.found.includes(memory.id)){this.found.push(memory.id);r.emit('discovery',{text:'Discovery found: '+memory.title+' · a keepsake, no points'})}}
 }
 this.trails=this.trails.filter(t=>t.points.at(-1).x>-30&&!t.done);
 }
}
root.CatDiscovery={System,MEMORIES};if(typeof module!=='undefined')module.exports=root.CatDiscovery;
})(globalThis);
