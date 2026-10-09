let ambience;
function updateAmbience(){
 if(!audio)return;
 if(!ambience){const bus=audio.createGain();bus.gain.value=0;bus.connect(audio.destination);const voices=[0,1,2,3].map(()=>{const o=audio.createOscillator(),v=audio.createGain();o.type='sine';v.gain.value=.045;o.connect(v).connect(bus);o.start();return o});ambience={bus,voices,key:''};}
 const active=!muted&&screen==='play'&&g&&!['paused','finished'].includes(g.phase),silence=g?.phase==='dialogue'&&g.arena?.m===2000&&g.memories.has('main-1')&&g.dialogueIndex>=2&&g.dialogueIndex<=4;
 ambience.bus.gain.setTargetAtTime(active&&!silence?.3:0,audio.currentTime,.5);
 if(!active)return;const scene=g.mode==='endless'?'endless':currentScene().id,key=g.phase==='arena'?'battle':scene;
 if(ambience.key!==key){ambience.key=key;const chord=key==='battle'?[98,130.81,146.83,196]:key==='loop'?[110,130.81,164.81,220]:key==='escape'?[103.83,138.59,155.56,207.65]:[130.81,155.56,196,261.63];ambience.voices.forEach((o,i)=>o.frequency.setTargetAtTime(chord[i],audio.currentTime,1.2));}
}
