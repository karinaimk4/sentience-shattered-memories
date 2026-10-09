from pathlib import Path
import urllib.request,json,concurrent.futures,subprocess
R=Path(__file__).resolve().parents[1];D=R/'docs/audio-research';A=R/'assets/audio';A.mkdir(exist_ok=True)
records=json.loads((D/'api-6.json').read_text(encoding='utf-8'))['data']['list']
sources=[{'id':'official-bgm','url':json.loads((D/'api-2.json').read_text(encoding='utf-8'))['bg-audio'],'file':'official-site-bgm.mp3','type':'music','sourcePage':'https://honkaiimpact3.hoyoverse.com/global/en-us/home'}]
for r in records:
 e=json.loads(r['sExt']);name=e.get('521_1')
 if name not in ['Herrscher of Sentience','Azure Empyrea']:continue
 tag='hos' if name=='Herrscher of Sentience' else 'hua'
 for key,action in [('521_10','attack'),('521_26','evade'),('521_34','ultimate')]:
  if e.get(key):sources.append({'id':tag+'-'+action,'url':e[key][0]['url'],'file':tag+'-'+action+'.mp4','type':'reference-video','character':name,'sourcePage':'https://honkaiimpact3.hoyoverse.com/global/en-us/valkyries'})
for r in json.loads((D/'api-4.json').read_text(encoding='utf-8'))['data']['list']:
 if 'Hua' in str(r) or '符华' in str(r):print('Character:',json.dumps(r,ensure_ascii=False))
def fetch(s):
 try:
  data=urllib.request.urlopen(urllib.request.Request(s['url'],headers={'User-Agent':'Mozilla/5.0'}),timeout=45).read();p=(A if s['type']=='music' else D)/s['file'];p.write_bytes(data);s['bytes']=len(data);s['local']=str(p.relative_to(R));print(s['id'],len(data),flush=True)
  if s['type']=='reference-video':
   out=D/(s['id']+'.wav');subprocess.run(['ffmpeg','-v','error','-y','-i',str(p),'-vn','-ac','1','-ar','24000',str(out)],check=True);s['wav']=str(out.relative_to(R))
 except Exception as ex:s['error']=str(ex);print(s['id'],str(ex),flush=True)
 return s
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(fetch,sources))
(D/'official-sources.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
