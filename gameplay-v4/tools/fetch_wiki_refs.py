from pathlib import Path
import urllib.request,urllib.parse,hashlib,json,concurrent.futures
from PIL import Image
R=Path(__file__).resolve().parents[1];P=R/'docs/wiki-references';P.mkdir(exist_ok=True)
names=[f'{name} ({slot}).png' for name in ['Attila','Marco Polo','Dirac','Shattered Swords','Pericles'] for slot in ['T','M','B']]
names += [f'{name} ({rarity}) (Icon).png' for name,rarity in [('Armored Bracers',1),('CAS-II Namiko',3),('Grips of Tai Xuan',4),('Keys of Oblivion',4),('Domain of Sentience',5),('Infinite Intimidator',4),('Incredibly Infinite Intimidator',5)]]
def fetch(name):
 f=name.replace(' ','_');h=hashlib.md5(f.encode()).hexdigest();u=f'https://static.wikia.nocookie.net/honkaiimpact3_gamepedia_en/images/{h[0]}/{h[:2]}/{urllib.parse.quote(f)}/revision/latest'
 try:
  data=urllib.request.urlopen(u,timeout=25).read();path=P/f;path.write_bytes(data);im=Image.open(path);assert im.width>64 and im.height>64
  return {'name':name,'url':u,'path':str(path),'size':im.size,'bytes':len(data)}
 except Exception as e:return {'name':name,'error':str(e),'url':u}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:results=list(pool.map(fetch,names))
(P/'sources.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
for r in results:print(json.dumps(r,ensure_ascii=False))
