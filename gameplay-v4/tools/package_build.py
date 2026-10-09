from pathlib import Path
import shutil,zipfile,json,hashlib
R=Path(__file__).resolve().parents[1];B=R/'build'
assert B.resolve().parent == R.resolve(), 'Refusing to clean a build outside the project'
if B.exists(): shutil.rmtree(B)
B.mkdir()
files=['story-environment.js','environment-runtime.js','boss-husk.js','boss-chariot.js','boss-heimdall.js','boss-parvati.js','boss-phantom.js','boss-seven-swords.js','boss-jizo.js','boss-mnemosyne.js','taixuan-courtyard.js','taixuan-side-memories.js','memory-album.js','story-crafting.js','story-sessions.js','story-panels.js','audio-system.js','audio-manifest.json','index.html','styles-v2.css','battle-track.css','memory-album.css','loadout.css','narrative.css','gameplay-v2.js','engine.js','gear-system.js','canonical-catalog.js','save-validation.js','loadout.js','assets-manifest.json','animation-manifest.json','level-chapter-1.json','level-chapter-2.json','level-chapter-3.json','level-chapter-4.json','level-chapter-5.json','level-chapter-6.json','level-chapter-7.json','endless-patterns.json','enemy-story-manifest.json','terrain-story-manifest.json']
for name in files:
 data=(R/name).read_bytes()
 if name=='gameplay-v2.js':
  text=data.decode('utf-8-sig');text='\n'.join(line for line in text.splitlines() if not line.strip().startswith('if(QA)window.__qa='));text=text.replace("QA=new URLSearchParams(location.search).has('qa')",'QA=false');data=text.encode('utf-8')
 (B/name).write_bytes(data)
shutil.copytree(R/'assets',B/'assets',dirs_exist_ok=True)
shutil.copy2(R/'README.md',B/'README.md')
(B/'docs/audio-research').mkdir(parents=True,exist_ok=True)
for name in ['WIKI-EQUIPMENT.md','AUDIO-SOURCES.md','STORY-UPDATE-20260927.md','FORGE-PROGRESSION.md','CHAPTER-2.md','CHAPTER-3.md','CHAPTER-4-5.md','CHAPTER-6.md','CHAPTER-7.md','CH1-3-CINEMATIC-V3-DE-DUYET.md','CH4-6-CINEMATIC-V3-DE-DUYET.md','CH5-CINEMATIC-V3-DE-DUYET.md','CH7-KICH-BAN-CINEMATIC-V3-DE-DUYET.md','CO-CHE-BOSS-VA-MAP-7-CHUONG.md']: shutil.copy2(R/'docs'/name,B/'docs'/name)
shutil.copy2(R/'docs/audio-research/official-sources.json',B/'docs/audio-research/official-sources.json')
old=R.parent/'gameplay-v3-story/assets/original-library'
preserved=0
for p in old.rglob('*'):
 if p.is_file():
  assert p.read_bytes()==(B/'assets/original-library'/p.relative_to(old)).read_bytes(),f'Changed original: {p.name}'
  preserved+=1
assert '__qa' not in (B/'gameplay-v2.js').read_text(encoding='utf-8')
artifact=R/'sentience-v4-story-endless-static.zip'
with zipfile.ZipFile(artifact,'w',zipfile.ZIP_DEFLATED,6) as z:
 for p in B.rglob('*'):
  if p.is_file():z.write(p,p.relative_to(B))
manifest=[{'file':p.relative_to(B).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in B.rglob('*') if p.is_file()]
(R/'qa/build-manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps({'files':len(manifest),'originalAssetsUnchanged':preserved,'zipBytes':artifact.stat().st_size,'zip':str(artifact)}))


