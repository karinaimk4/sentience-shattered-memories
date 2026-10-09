const fs=require('node:fs'),zlib=require('node:zlib');
for(const file of process.argv.slice(2)){
 const b=fs.readFileSync(file),w=b.readUInt32BE(16),h=b.readUInt32BE(20),depth=b[24],type=b[25];
 let p=8,idat=[];while(p<b.length){const n=b.readUInt32BE(p),name=b.toString('ascii',p+4,p+8);if(name==='IDAT')idat.push(b.subarray(p+8,p+8+n));p+=12+n;}
 let min=255,max=0,transparent=0;
 if(depth===8&&type===6){const raw=zlib.inflateSync(Buffer.concat(idat)),stride=w*4,prev=Buffer.alloc(stride),row=Buffer.alloc(stride);let pos=0;for(let y=0;y<h;y++){const f=raw[pos++];for(let x=0;x<stride;x++){const a=x>=4?row[x-4]:0,up=prev[x],ul=x>=4?prev[x-4]:0,v=raw[pos++];let z=v;if(f===1)z=(v+a)&255;else if(f===2)z=(v+up)&255;else if(f===3)z=(v+Math.floor((a+up)/2))&255;else if(f===4){const q=a+up-ul,pa=Math.abs(q-a),pb=Math.abs(q-up),pc=Math.abs(q-ul);z=(v+(pa<=pb&&pa<=pc?a:pb<=pc?up:ul))&255;}row[x]=z;}for(let x=3;x<stride;x+=4){const a=row[x];min=Math.min(min,a);max=Math.max(max,a);if(a<250)transparent++;}row.copy(prev);}}
 console.log(JSON.stringify({file,w,h,depth,type,alphaMin:min,alphaMax:max,transparentPixels:transparent}));
}
