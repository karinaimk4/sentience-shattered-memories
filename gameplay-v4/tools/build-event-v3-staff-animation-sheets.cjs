const { chromium } = require('./playwright-runtime.cjs');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const modelDir = path.join(root, 'assets', 'event-v3', 'staff-model-sheets');
const previewDir = path.join(root, 'assets', 'event-v3', 'staff-sprites');
const animationDir = path.join(root, 'assets', 'event-v3', 'staff-animation');
const generated = ['elysia','kiana','griseo','yae','sushang','pardofelis','himeko','bronya','mei','seele','veliona'];
const existing = {
  senti:path.join(root,'assets','event-v3','preview-sprites','senti-preview.png'),
  fuhua:path.join(root,'assets','event-v3','preview-sprites','fuhua-preview.png'),
  rozaliya:path.join(root,'assets','event-v3','preview-sprites','rozaliya-preview.png'),
  liliya:path.join(root,'assets','event-v3','preview-sprites','liliya-preview.png')
};

(async()=>{
  fs.mkdirSync(previewDir,{recursive:true});fs.mkdirSync(animationDir,{recursive:true});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage();await page.setContent('<!doctype html><title>staff sheet builder</title>');
  for(const id of generated){
    const source=path.join(modelDir,`${id}.png`);
    const input=`data:image/png;base64,${fs.readFileSync(source).toString('base64')}`;
    const output=await page.evaluate(async input=>{
      const image=new Image();image.src=input;await image.decode();
      const scan=document.createElement('canvas');scan.width=image.naturalWidth;scan.height=image.naturalHeight;
      const sctx=scan.getContext('2d',{willReadFrequently:true});sctx.drawImage(image,0,0);const px=sctx.getImageData(0,0,scan.width,scan.height).data;
      const sheet=document.createElement('canvas');sheet.width=144;sheet.height=64;const ctx=sheet.getContext('2d',{willReadFrequently:true});ctx.imageSmoothingEnabled=false;
      for(let pose=0;pose<3;pose++){
        const segL=Math.floor(pose*scan.width/3),segR=Math.floor((pose+1)*scan.width/3)-1;
        let l=segR,t=scan.height-1,r=segL,b=0,found=false;
        for(let y=0;y<scan.height;y++)for(let x=segL;x<=segR;x++){if(px[(y*scan.width+x)*4+3]<40)continue;found=true;l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
        if(!found)continue;const cw=r-l+1,ch=b-t+1,scale=Math.min(46/cw,58/ch),dw=Math.max(1,Math.floor(cw*scale)),dh=Math.max(1,Math.floor(ch*scale));
        ctx.drawImage(image,l,t,cw,ch,pose*48+Math.floor((48-dw)/2),60-dh,dw,dh);
      }
      const out=ctx.getImageData(0,0,144,64);for(let i=3;i<out.data.length;i+=4)out.data[i]=out.data[i]>=40?255:0;ctx.putImageData(out,0,0);return sheet.toDataURL('image/png');
    },input);
    const file=path.join(previewDir,`${id}.png`);fs.writeFileSync(file,Buffer.from(output.split(',')[1],'base64'));existing[id]=file;
  }
  for(const [id,file] of Object.entries(existing)){
    const input=`data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
    const output=await page.evaluate(async input=>{
      const image=new Image();image.src=input;await image.decode();
      const sheet=document.createElement('canvas');sheet.width=192;sheet.height=576;const ctx=sheet.getContext('2d');ctx.imageSmoothingEnabled=false;
      const poseForRow=[0,0,1,2,0,0,0,0,0];
      const yOffsets=[[0,-1,0,-1],[0,-2,0,-2],[0,-2,0,-2],[0,-2,0,-2],[0,-1,-2,-1],[0,-2,-1,-2],[-2,-5,-2,0],[3,4,3,4],[-1,1,-1,1]];
      const xOffsets=[[0,0,0,0],[-2,0,2,0],[-2,0,2,0],[-2,0,2,0],[-1,1,-1,1],[-2,0,2,0],[0,0,0,0],[-2,2,-2,2],[-1,1,-1,1]];
      for(let row=0;row<9;row++)for(let frame=0;frame<4;frame++){
        const pose=poseForRow[row],dx=xOffsets[row][frame],dy=yOffsets[row][frame];ctx.save();
        const cx=frame*48+24,cy=row*64+60;
        if(row===7){ctx.translate(cx,cy);ctx.rotate(frame%2?.035:-.035);ctx.scale(1,.83);ctx.drawImage(image,pose*48,0,48,64,-24,-60,48,64);}
        else if(row===8){ctx.translate(cx,cy);ctx.rotate(frame%2?.055:-.055);ctx.drawImage(image,pose*48,0,48,64,-24,-60+dy,48,64);}
        else ctx.drawImage(image,pose*48,0,48,64,frame*48+dx,row*64+dy,48,64);
        ctx.restore();
      }
      const out=ctx.getImageData(0,0,192,576);for(let i=3;i<out.data.length;i+=4)out.data[i]=out.data[i]>=96?255:0;ctx.putImageData(out,0,0);return sheet.toDataURL('image/png');
    },input);
    fs.writeFileSync(path.join(animationDir,`${id}.png`),Buffer.from(output.split(',')[1],'base64'));
  }
  await browser.close();console.log(JSON.stringify({result:'PASS',characters:Object.keys(existing),animationSize:'192x576'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
