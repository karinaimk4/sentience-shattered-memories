const {chromium}=require('./playwright-runtime.cjs');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1600,height:1000}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4181/event-v3.html');
  await page.waitForFunction(()=>window.__TAIXUAN_QA__&&window.__TAIXUAN_WORLD__);
  const result=await page.evaluate(()=>{
    const w=window.__TAIXUAN_WORLD__;w.speed=0;
    const samples=[],stuck=[];
    for(let tick=0;tick<5400;tick++){
      w.update(1/60);
      if(tick%300===0)samples.push({time:Math.round(w.time),guests:w.guests.filter(g=>!g.done).map(g=>[g.id,g.guestState,g.tile,g.tableId,Math.round(g.patience)]),tables:w.tables.map(t=>[t.id,t.state,t.reserved]),jobs:w.jobs.filter(j=>!j.done).map(j=>[j.type,j.phase,j.claimedBy,j.payload.guestId]),reception:[w.staff('rozaliya').state,w.staff('rozaliya').tile,w.staff('rozaliya').jobId],senti:[w.staff('senti').state,w.staff('senti').tile,w.staff('senti').jobId]});
      for(const guest of w.guests.filter(g=>!g.done&&g.guestState==='AT_FRONT'&&g.stateAge>10))if(!stuck.some(entry=>entry.id===guest.id))stuck.push({id:guest.id,time:w.time,age:guest.stateAge,tableId:guest.tableId,freeTables:w.tables.filter(t=>t.placed&&t.state==='CLEAN'&&!t.reserved).length,jobs:w.jobs.filter(j=>!j.done).map(j=>[j.type,j.phase,j.claimedBy,j.payload.guestId])});
    }
    return {samples,stuck,served:w.metrics.served,angry:w.metrics.angry,completed:w.metrics.completedJobs,starvation:w.metrics.jobStarvationViolations};
  });
  console.log(JSON.stringify({result,errors}));
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
