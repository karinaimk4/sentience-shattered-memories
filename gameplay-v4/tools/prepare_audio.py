from pathlib import Path
import subprocess,json
R=Path(__file__).resolve().parents[1];D=R/'docs/audio-research';A=R/'assets/audio'
clips=[('hos-attack','slash-1',1.0,.35,'sfx'),('hos-attack','slash-2',2.2,.42,'sfx'),('hos-attack','impact',3.6,.42,'sfx'),('hos-evade','evade',1.0,.65,'sfx'),('hos-ultimate','hos-battle',.73,3.15,'voice'),('hua-ultimate','hua-battle',1.79,2.35,'voice')]
manifest={'music':{'file':'assets/audio/official-site-bgm.mp3','label':'Honkai Impact 3rd · nhạc nền trang chính thức'},'sfx':{},'voice':{},'provenance':'docs/audio-research/official-sources.json','note':'Voice and combat effects are short excerpts from the official skill demonstration mix, not isolated voice stems or narration of the Vietnamese script.'}
for src,name,start,duration,kind in clips:
 dest=A/(name+'.ogg')
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(start),'-t',str(duration),'-i',str(D/(src+'.wav')),'-af',f'afade=t=in:d=0.015,afade=t=out:st={duration-.05}:d=0.05,loudnorm=I=-20:TP=-2:LRA=7','-c:a','libvorbis','-q:a','4',str(dest)],check=True)
 manifest[kind][name]={'file':'assets/audio/'+dest.name,'source':src,'start':start,'duration':duration}
(R/'audio-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Prepared music, four combat effects, and two character combat excerpts.')
