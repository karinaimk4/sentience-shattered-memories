from pathlib import Path
import urllib.request,re,json,concurrent.futures
R=Path(__file__).resolve().parents[1];D=R/'docs/audio-research';D.mkdir(exist_ok=True)
urls=['https://honkaiimpact3.hoyoverse.com/global/en-us/valkyries','https://honkaiimpact3.hoyoverse.com/asia/en-us/home']
def get(u):
 try:
  data=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read().decode();name='page-'+str(urls.index(u));(D/(name+'.html')).write_text(data,encoding='utf-8');return {'url':u,'bytes':len(data),'scripts':re.findall(r'<script[^>]+src=["\']([^"\']+)',data),'audio':re.findall(r'https?[^\s"<>]+\.(?:mp3|ogg|wav)',data)}
 except Exception as e:return {'url':u,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for result in pool.map(get,urls):print(json.dumps(result))
