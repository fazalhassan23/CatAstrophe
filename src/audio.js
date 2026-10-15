(function(root){
class Audio{
 constructor(){this.volume=.45;this.music=0;this.ctx=null;this.beat=0;this.note=0}
 init(){try{this.ctx??=new(window.AudioContext||window.webkitAudioContext)();this.ctx.resume()}catch{}}
 tone(freq,duration=.08,kind='sine',gain=.12){if(!this.ctx||!this.volume)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain(),t=this.ctx.currentTime;o.type=kind;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(freq*.65,t+duration);g.gain.setValueAtTime(gain*this.volume,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(this.ctx.destination);o.start();o.stop(t+duration)}
 play(type){const notes={flap:210,fish:880,pass:520,over:120,near:1100,rescue:650,world:740,power:990,unlock:1300,mischief:690,bell:1450,graduated:1050};if(!notes[type])return;this.tone(notes[type]+(type==='flap'?Math.random()*30:0),type==='over'?.3:type==='world'?.3:.09,'sine')}
 update(dt,world,active){if(!active||!this.music||!this.ctx)return;this.beat+=dt;if(this.beat<.34)return;this.beat=0;const scales=[[262,330,392,440,392,330,294,330],[294,370,440,494,440,370,330,370],[220,262,330,392,330,262,247,294]],f=scales[world][this.note++%8];const o=this.ctx.createOscillator(),g=this.ctx.createGain(),t=this.ctx.currentTime;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(this.music*.09,t);g.gain.exponentialRampToValueAtTime(.001,t+.26);o.connect(g);g.connect(this.ctx.destination);o.start();o.stop(t+.27)}
}
root.CatAudio=Audio;
})(globalThis);
