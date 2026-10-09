const KEY='sentience-audio-settings-v1';
export class GameAudio{
 constructor(){this.settings={music:.32,sfx:.65,voice:.7};try{const s=JSON.parse(localStorage.getItem(KEY));for(const k of Object.keys(this.settings))if(Number.isFinite(s?.[k]))this.settings[k]=Math.max(0,Math.min(1,s[k]));}catch{}this.manifest=null;this.buffers=new Map();this.pending=new Map();this.voices=new Set();this.history=[];this.lastCue={};this.voiceUntil=0;this.muted=false;this.paused=true;this.music=null;this.lastTick=0;this.battleWidget=null;this.battleReady=false;this.battlePlaying=false;this.battleVolume=-1;this.widgetLoading=false;this.battleWanted=false;this.lastPlayAttempt=0;this.nextBeat=0;this.beatCount=0;this.load=fetch('audio-manifest.json').then(r=>r.json()).then(m=>this.manifest=m).catch(()=>null);}
 unlock(context){this.context=context;if(!this.music&&this.manifest){this.music=new Audio(this.manifest.music.file);this.music.loop=true;this.music.preload='auto';this.music.volume=0;}for(const entry of Object.values(this.manifest?.sfx||{}).concat(Object.values(this.manifest?.voice||{})))this.buffer(entry.file);}
 async buffer(src){if(this.buffers.has(src))return this.buffers.get(src);if(this.pending.has(src))return this.pending.get(src);if(!this.context)return null;const job=fetch(src).then(r=>r.arrayBuffer()).then(b=>this.context.decodeAudioData(b)).then(b=>{this.buffers.set(src,b);this.pending.delete(src);return b}).catch(()=>{this.pending.delete(src);return null});this.pending.set(src,job);return job;}
 setVolume(key,value){this.settings[key]=Math.max(0,Math.min(1,value));try{localStorage.setItem(KEY,JSON.stringify(this.settings))}catch{}for(const source of this.voices)source.gain.gain.value=this.muted||this.paused?0:this.settings[source.kind];if(key==='music'&&this.battleWidget&&this.battleReady){this.battleVolume=this.battleWanted?Math.round(this.settings.music*100):0;this.battleWidget.setVolume(this.battleVolume);}}
 async cue(name,{voice=false,cooldown=.12}={}){const now=performance.now()/1000;if(!this.context||this.muted||this.paused||this.settings[voice?'voice':'sfx']===0||now-(this.lastCue[name]??-Infinity)<cooldown)return;const entry=this.manifest?.[voice?'voice':'sfx']?.[name];if(!entry)return;this.lastCue[name]=now;const buffer=await this.buffer(entry.file);if(!buffer||this.muted||this.paused)return;if(voice&&now<this.voiceUntil)return;const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;gain.gain.value=this.settings[voice?'voice':'sfx'];source.connect(gain).connect(this.context.destination);const active={source,gain,kind:voice?'voice':'sfx'};this.voices.add(active);source.onended=()=>this.voices.delete(active);source.start();this.history.push(name);if(this.history.length>60)this.history.shift();if(voice)this.voiceUntil=now+buffer.duration;}
 update({enabled,muted,silence=false,dialogue=false,battle=false}){this.muted=muted;const nextPaused=!enabled;if(nextPaused&&!this.paused){for(const v of this.voices){try{v.source.stop()}catch{}}this.voices.clear();}this.paused=nextPaused;if(muted)for(const v of this.voices)v.gain.gain.value=0;
  this.syncBattle({enabled,muted,silence,battle});
  if(!this.music||!this.context)return;const now=performance.now()/1000,dt=Math.min(.1,now-(this.lastTick||now));this.lastTick=now;const target=enabled&&!muted&&!silence?this.settings.music*(battle?(this.battlePlaying?0:.23):dialogue||now<this.voiceUntil?.28:1):0;this.music.volume+=Math.max(-dt*.65,Math.min(dt*.65,target-this.music.volume));if(target>0&&this.music.paused)this.music.play().catch(()=>{});if(target===0&&this.music.volume<.005)this.music.pause();
  if(this.battleWanted&&!this.battlePlaying)this.battleBeat(now);
 }
 loadBattleWidget(){
  if(this.widgetLoading)return;this.widgetLoading=true;
  const frame=document.getElementById('battle-soundcloud'),status=document.getElementById('battle-track-status');if(!frame)return;
  const track='https://soundcloud.com/albedo_simp/honkai-impact-3rd-hos-trailer';
  frame.src='https://w.soundcloud.com/player/?url='+encodeURIComponent(track)+'&auto_play=false&show_artwork=false&show_user=true&show_playcount=false&sharing=false&download=false';
  const script=document.createElement('script');script.src='https://w.soundcloud.com/player/api.js';script.async=true;
  script.onload=()=>{if(!window.SC?.Widget){status.textContent='Không kết nối được · dùng nhạc dự phòng';return;}const widget=this.battleWidget=window.SC.Widget(frame);const events=window.SC.Widget.Events;
   widget.bind(events.READY,()=>{this.battleReady=true;status.textContent='Nhạc từ SoundCloud · bấm Play nếu trình duyệt chặn tự phát';this.battleVolume=Math.round(this.settings.music*100);widget.setVolume(this.battleVolume);if(this.battleWanted){this.lastPlayAttempt=performance.now()/1000;widget.play();}});
   widget.bind(events.PLAY,()=>{this.battlePlaying=true;status.textContent='Đang phát · HoS Trailer';});
   widget.bind(events.PAUSE,()=>{this.battlePlaying=false;});
   widget.bind(events.FINISH,()=>{this.battlePlaying=false;if(this.battleWanted){widget.seekTo(0);widget.play();}});
   widget.bind(events.ERROR,()=>{this.battlePlaying=false;status.textContent='SoundCloud không khả dụng · dùng nhạc dự phòng';});
  };
  script.onerror=()=>{status.textContent='SoundCloud không tải được · dùng nhạc dự phòng';};
  document.head.append(script);
 }
 syncBattle({enabled,muted,silence,battle}){
  const panel=document.getElementById('battle-track');if(panel)panel.hidden=!battle;
  this.battleWanted=!!(battle&&enabled&&!muted&&!silence&&this.settings.music>0);
  if(battle&&!this.widgetLoading)this.loadBattleWidget();
  if(!this.battleWidget||!this.battleReady)return;
  const volume=this.battleWanted?Math.round(this.settings.music*100):0;if(volume!==this.battleVolume){this.battleVolume=volume;this.battleWidget.setVolume(volume);}
  const now=performance.now()/1000;
  if(this.battleWanted&&!this.battlePlaying&&now-this.lastPlayAttempt>4){this.lastPlayAttempt=now;this.battleWidget.play();}
  else if(!this.battleWanted&&this.battlePlaying)this.battleWidget.pause();
 }
 battleBeat(now){
  if(!this.context||now<this.nextBeat)return;this.nextBeat=now+.34;const beat=this.beatCount++,c=this.context,base=beat%4===0?110:beat%2===0?75:660,duration=beat%2===0?.16:.045;
  const osc=c.createOscillator(),gain=c.createGain();osc.type=beat%2===0?'triangle':'square';osc.frequency.setValueAtTime(base,c.currentTime);osc.frequency.exponentialRampToValueAtTime(beat%2===0?48:240,c.currentTime+duration);gain.gain.setValueAtTime((beat%2===0?.085:.025)*this.settings.music,c.currentTime);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);osc.connect(gain).connect(c.destination);osc.start();osc.stop(c.currentTime+duration);
 }
 get status(){return {loaded:!!this.manifest,musicPlaying:!!this.music&&!this.music.paused,volume:this.music?.volume||0,battle:{ready:this.battleReady,playing:this.battlePlaying,wanted:this.battleWanted,source:'SoundCloud HoS Trailer',fallback:!this.battlePlaying},settings:{...this.settings},history:[...this.history],decoded:this.buffers.size};}
}
