(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const colors = {bg:"#081421", grid:"#1d3045", text:"#9fb2c8", green:"#55e0a3", red:"#ff7787", ma20:"#55e0a3", ma50:"#66b8ff", ma200:"#f4c66b", purple:"#c1a5ff", amber:"#f4c66b"};
  let series = [];
  let currentSymbol = "DEMO";

  function generateSeries(kind="DEMO", count=100) {
    let p = kind === "BEAR" ? 130 : kind === "RANGE" ? 100 : 80;
    const out=[]; let seed = kind.split("").reduce((a,c)=>a+c.charCodeAt(0),17);
    const rand=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
    for(let i=0;i<count;i++){
      const drift = kind==="BULL" ? 0.42 : kind==="BEAR" ? -0.34 : kind==="RANGE" ? Math.sin(i/4)*0.04 : (i<35?0.48:i<55?-0.32:0.16);
      const open=p+(rand()-.5)*2.2;
      const close=Math.max(8,open+drift+(rand()-.49)*3.5);
      const high=Math.max(open,close)+rand()*2.0;
      const low=Math.min(open,close)-rand()*2.0;
      out.push({open,high,low,close,volume:1000+rand()*9000});
      p=close;
    }
    return out;
  }
  function heikin(data){
    let prevOpen=(data[0].open+data[0].close)/2, prevClose=(data[0].open+data[0].high+data[0].low+data[0].close)/4;
    return data.map((d,i)=>{
      const close=(d.open+d.high+d.low+d.close)/4;
      const open=i===0?prevOpen:(prevOpen+prevClose)/2;
      const item={open,close,high:Math.max(d.high,open,close),low:Math.min(d.low,open,close),volume:d.volume};
      prevOpen=open;prevClose=close;return item;
    });
  }
  function sma(data, n, key="close"){return data.map((_,i)=>{if(i<n-1)return null;let s=0;for(let j=i-n+1;j<=i;j++)s+=data[j][key];return s/n;});}
  function ema(vals,n){const out=[];const k=2/(n+1);let prev=null;vals.forEach((v,i)=>{prev=prev===null?v:v*k+prev*(1-k);out.push(i<n-1?null:prev)});return out;}
  function rsi(vals,n=14){const out=[];let ag=0,al=0;for(let i=0;i<vals.length;i++){if(i===0){out.push(null);continue;}let ch=vals[i]-vals[i-1],g=Math.max(ch,0),l=Math.max(-ch,0);if(i<=n){ag+=g/n;al+=l/n;out.push(i===n?(al===0?100:100-100/(1+ag/al)):null)}else{ag=(ag*(n-1)+g)/n;al=(al*(n-1)+l)/n;out.push(al===0?100:100-100/(1+ag/al));}}return out;}
  function stochastic(data,n=14,smooth=3){const raw=data.map((d,i)=>{if(i<n-1)return null;const slice=data.slice(i-n+1,i+1),hi=Math.max(...slice.map(x=>x.high)),lo=Math.min(...slice.map(x=>x.low));return hi===lo?50:100*(d.close-lo)/(hi-lo)});return raw.map((_,i)=>{if(i<smooth-1||raw.slice(i-smooth+1,i+1).some(v=>v===null))return null;return raw.slice(i-smooth+1,i+1).reduce((a,b)=>a+b,0)/smooth;});}
  function setupCanvas(canvas){const rect=canvas.getBoundingClientRect();const dpr=window.devicePixelRatio||1;canvas.width=Math.max(1,Math.floor(rect.width*dpr));canvas.height=Math.max(1,Math.floor(rect.height*dpr));const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,w:rect.width,h:rect.height};}
  function drawMain(){
    const canvas=$("#priceChart");if(!canvas)return;
    const {ctx,w,h}=setupCanvas(canvas);ctx.clearRect(0,0,w,h);ctx.fillStyle=colors.bg;ctx.fillRect(0,0,w,h);
    const raw=series, candles=$("#candleMode").value==="heikin"?heikin(raw):raw;
    const m20=sma(raw,20),m50=sma(raw,50),m200=sma(raw,200);
    const pad={l:42,r:12,t:16,b:25}, cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
    const vals=candles.flatMap((d,i)=>[d.high,d.low,m20[i],m50[i],m200[i]].filter(v=>v!==null&&Number.isFinite(v)));
    let min=Math.min(...vals),max=Math.max(...vals);if(max===min){max++;min--;}const extra=(max-min)*.08;min-=extra;max+=extra;
    const y=v=>pad.t+(max-v)/(max-min)*ch, x=i=>pad.l+(i+.5)*cw/candles.length;
    ctx.font="10px DM Mono, monospace";ctx.strokeStyle=colors.grid;ctx.fillStyle=colors.text;ctx.lineWidth=1;
    for(let j=0;j<=5;j++){let yy=pad.t+ch*j/5;ctx.beginPath();ctx.moveTo(pad.l,yy);ctx.lineTo(w-pad.r,yy);ctx.stroke();ctx.fillText((max-(max-min)*j/5).toFixed(1),3,yy+3);}
    function line(arr,color,width){ctx.beginPath();let started=false;arr.forEach((v,i)=>{if(v===null||!Number.isFinite(v))return;const xx=x(i),yy=y(v);if(!started){ctx.moveTo(xx,yy);started=true;}else ctx.lineTo(xx,yy);});ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
    const step=cw/candles.length, bodyW=Math.max(2,Math.min(9,step*.62));
    candles.forEach((d,i)=>{const xx=x(i),yo=y(d.open),yc=y(d.close),yh=y(d.high),yl=y(d.low),up=d.close>=d.open;ctx.strokeStyle=up?colors.green:colors.red;ctx.fillStyle=up?colors.green:colors.red;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(xx,yh);ctx.lineTo(xx,yl);ctx.stroke();const bh=Math.max(1,Math.abs(yc-yo));ctx.fillRect(xx-bodyW/2,Math.min(yo,yc),bodyW,bh);});
    line(m200,colors.ma200,1.7);line(m50,colors.ma50,1.5);line(m20,colors.ma20,1.5);
    ctx.fillStyle=colors.text;ctx.fillText("Older",pad.l,h-7);ctx.textAlign="right";ctx.fillText($("#timeframe").value+" · sample bars",w-pad.r,h-7);ctx.textAlign="left";
    const last=raw[raw.length-1].close;$("#lastClose").textContent=last.toFixed(2)+" (sample)";
    const t20=m20[m20.length-1],t50=m50[m50.length-1],t200=m200[m200.length-1];
    const trend=t20>t50&&t50>t200?"Bullish MA alignment":t20<t50&&t50<t200?"Bearish MA alignment":"Mixed / transitional";
    $("#trendRead").textContent=trend;$("#modeRead").textContent=$("#candleMode").value==="heikin"?"Heikin-Ashi":"Regular candles";
    drawOscillator($("#stochChart"),stochastic(raw),[20,80],colors.purple);
    drawOscillator($("#rsiChart"),rsi(raw.map(d=>d.close)),[30,70],colors.blue);
    const closes=raw.map(d=>d.close), e12=ema(closes,12),e26=ema(closes,26),macd=e12.map((v,i)=>v===null||e26[i]===null?null:v-e26[i]),sig=ema(macd.map(v=>v===null?0:v),9);
    drawHistogram($("#macdChart"),macd.map((v,i)=>v===null||sig[i]===null?null:v-sig[i]));
  }
  function drawOscillator(canvas,vals,levels,color){
    const {ctx,w,h}=setupCanvas(canvas);ctx.clearRect(0,0,w,h);ctx.fillStyle=colors.bg;ctx.fillRect(0,0,w,h);
    const pad=8, y=v=>h-pad-(v/100)*(h-2*pad);ctx.strokeStyle=colors.grid;ctx.setLineDash([4,4]);levels.forEach(v=>{ctx.beginPath();ctx.moveTo(0,y(v));ctx.lineTo(w,y(v));ctx.stroke();});ctx.setLineDash([]);
    ctx.beginPath();let started=false;vals.forEach((v,i)=>{if(v===null||!Number.isFinite(v))return;let xx=i/(vals.length-1)*w,yy=y(v);if(!started){ctx.moveTo(xx,yy);started=true;}else ctx.lineTo(xx,yy);});ctx.strokeStyle=color;ctx.lineWidth=1.8;ctx.stroke();
  }
  function drawHistogram(canvas,vals){
    const {ctx,w,h}=setupCanvas(canvas);ctx.clearRect(0,0,w,h);ctx.fillStyle=colors.bg;ctx.fillRect(0,0,w,h);const mid=h/2;ctx.strokeStyle=colors.grid;ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(w,mid);ctx.stroke();const max=Math.max(0.001,...vals.filter(v=>v!==null).map(Math.abs));const bw=w/vals.length;
    vals.forEach((v,i)=>{if(v===null)return;const bh=(v/max)*(h*.43);ctx.fillStyle=v>=0?colors.green:colors.red;ctx.fillRect(i*bw, v>=0?mid-bh:mid, Math.max(1,bw*.7),Math.abs(bh));});
  }
  const strategies={
    long:{title:"Directional calls and puts",tag:"Core RO’Lyfe workflow",purpose:"For a chart-backed bullish or bearish thesis where you want defined premium-at-risk exposure.",bullets:["Mark the underlying stock entry and chart invalidation first.","Compare ATM, ITM and OTM contracts for delta, spread, liquidity, volatility and total premium risk.","Plan profit targets, partial exits and runner rules before entry.","A long option can lose 100% of the premium paid; a stock stop does not guarantee a matching option exit."],meta:["Preferred study window: ATM 14–20 DTE","Risk: premium paid","Best context: directional setup"]},
    covered:{title:"Covered calls",tag:"Shares + short call",purpose:"For an investor who owns sufficient shares and is willing to sell them at the call strike in exchange for premium.",bullets:["One standard equity call contract typically covers 100 shares; verify contract specifications.","Premium offers only limited downside cushion against falling shares.","Upside is capped above the strike, and assignment can require selling shares.","This is not a required add-on to a long call or put trade."],meta:["Typical unit: 100 shares / 1 call","Risk: substantial stock downside","Best context: willing-to-sell ownership"]},
    calendar:{title:"Calendar spread",tag:"Different expirations",purpose:"Typically combines a short near-term option and a longer-term option at the same strike; the exact structure and direction matter.",bullets:["Often studied when expecting price to stay near the strike into the nearer expiration.","Results depend on time decay, implied-volatility changes, price movement and expiration management.","The short option can expire before the long option; plan assignment and leg risk.","Do not use a directional long-option bracket as a substitute for spread-specific risk analysis."],meta:["Structure: same strike, different expirations","Risk: structure-specific; debit may be at risk","Best context: time/volatility thesis"]},
    vertical:{title:"Vertical spread",tag:"Defined-risk spread",purpose:"Combines options of the same type and expiration at different strikes to shape cost, payoff and risk.",bullets:["Can express bullish or bearish views with calls or puts.","A debit spread generally limits loss to the debit; a credit spread has different maximum-loss math.","Compare maximum profit, maximum loss, breakeven and liquidity before considering entry.","Legging, early assignment and expiration settlement can add practical risks."],meta:["Structure: same expiration, different strikes","Risk: calculate from spread width and credit/debit","Best context: defined payoff objective"]}
  };
  function renderStrategy(key){const s=strategies[key],el=$("#strategyDetail");el.innerHTML=`<p class="eyebrow">${s.tag.toUpperCase()}</p><h3>${s.title}</h3><p>${s.purpose}</p><ul>${s.bullets.map(x=>`<li>${x}</li>`).join("")}</ul><div class="strategy-meta">${s.meta.map(x=>`<span>${x}</span>`).join("")}</div>`;}
  $$(".strategy-tab").forEach(btn=>btn.addEventListener("click",()=>{$$(".strategy-tab").forEach(b=>{b.classList.toggle("active",b===btn);b.setAttribute("aria-selected",b===btn?"true":"false");});renderStrategy(btn.dataset.strategy);}));
  function refresh(){currentSymbol=$("#chartSymbol").value;series=generateSeries(currentSymbol,100);drawMain();}
  $("#chartSymbol").addEventListener("change",refresh);$("#candleMode").addEventListener("change",drawMain);$("#timeframe").addEventListener("change",drawMain);$("#refreshChart").addEventListener("click",refresh);
  $("#plannerForm").addEventListener("submit",e=>{
    e.preventDefault();const entry=Number($("#entry").value),inv=Number($("#invalidation").value),target=Number($("#target").value),premium=Number($("#premium").value),contracts=Math.max(1,Math.floor(Number($("#contracts").value)||1)),budget=Number($("#maxLoss").value),dir=$("#direction").value;
    if(!(entry>0&&inv>0)){return;}const distance=Math.abs(entry-inv),riskPct=distance/entry*100,validDir=dir==="Bullish"?inv<entry:dir==="Bearish"?inv>entry:true;
    const targetR=target>0&&distance>0?Math.abs(target-entry)/distance:null,exposure=premium>0?premium*100*contracts:null;
    let html=`<div class="risk-result"><p class="eyebrow">PLANNING REVIEW</p><h3>${$("#underlying").value.trim()||"Unspecified symbol"} · ${dir}</h3><div class="result-grid"><div class="result-tile"><small>Stock entry</small><strong>$${entry.toFixed(2)}</strong></div><div class="result-tile"><small>Chart invalidation</small><strong>$${inv.toFixed(2)}</strong></div><div class="result-tile"><small>Stock distance</small><strong>$${distance.toFixed(2)}</strong></div><div class="result-tile"><small>Distance from entry</small><strong>${riskPct.toFixed(2)}%</strong></div>`;
    if(targetR!==null)html+=`<div class="result-tile"><small>Target distance / chart risk</small><strong>${targetR.toFixed(2)}R</strong></div>`;
    if(exposure!==null)html+=`<div class="result-tile"><small>Gross premium exposure*</small><strong>$${exposure.toFixed(2)}</strong></div>`;
    html+=`</div><p class="result-note">${validDir?"Chart levels are directionally consistent with the selected idea.":"Check your entry, invalidation and directional idea; the levels may conflict."}${budget>0&&exposure!==null?(exposure>budget?` Premium exposure exceeds the entered risk budget by $${(exposure-budget).toFixed(2)}.`:` Premium exposure is within the entered budget, before costs.`):""}</p><p class="tiny muted">*For a standard 100-share equity option contract, premium × 100 × contracts is the approximate initial debit, excluding fees. It is not an estimate of the loss at your stock-chart invalidation. Confirm contract multiplier and product specifications.</p></div>`;
    $("#planOutput").innerHTML=html;
  });
  const journalKey="rolyfeClassroomJournalV1";let journal=[];
  try{journal=JSON.parse(localStorage.getItem(journalKey)||"[]");if(!Array.isArray(journal))journal=[];}catch(_){journal=[];}
  function renderJournal(){const host=$("#journalEntries");if(!journal.length){host.innerHTML='<p class="muted">No notes yet. Your entries will remain in this browser on this device.</p>';return;}host.innerHTML=journal.map((x,i)=>`<article class="journal-entry"><strong>${escapeHtml(x.symbol)}</strong><p>${escapeHtml(x.note)}</p><small>${escapeHtml(x.date)}</small> <button class="btn ghost small delete-note" data-index="${i}" aria-label="Delete journal entry">Delete</button></article>`).join("");$$(".delete-note",host).forEach(b=>b.addEventListener("click",()=>{journal.splice(Number(b.dataset.index),1);saveJournal();}));}
  function saveJournal(){try{localStorage.setItem(journalKey,JSON.stringify(journal));}catch(_){ }renderJournal();}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  $("#journalForm").addEventListener("submit",e=>{e.preventDefault();journal.unshift({symbol:$("#journalSymbol").value.trim(),note:$("#journalNote").value.trim(),date:new Date().toLocaleString()});saveJournal();e.target.reset();});
  $("#exportJournal").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(journal,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="rolyfe-trading-journal.json";a.click();URL.revokeObjectURL(url);});
  const fab=$("#aiFab"),panel=$("#aiPanel");function toggleAI(open){panel.hidden=!open;fab.setAttribute("aria-expanded",String(open));if(open)$("#aiQuestion").focus();}
  fab.addEventListener("click",()=>toggleAI(panel.hidden));$("#aiClose").addEventListener("click",()=>toggleAI(false));
  $$(".ai-chips button").forEach(b=>b.addEventListener("click",()=>{$("#aiQuestion").value=b.dataset.prompt;$("#aiQuestion").focus();}));
  $("#copyPrompt").addEventListener("click",async()=>{const q=$("#aiQuestion").value.trim();if(!q){$("#aiStatus").textContent="Enter a question or choose a topic first.";return;}try{await navigator.clipboard.writeText(q);$("#aiStatus").textContent="Question copied. Paste it into your preferred AI assistant.";}catch(_){$("#aiQuestion").select();$("#aiStatus").textContent="Clipboard permission unavailable. Select and copy the question manually.";}});
  $("#clearPrompt").addEventListener("click",()=>{$("#aiQuestion").value="";$("#aiStatus").textContent="Question cleared.";});
  const menu=$("#mainNav"),mt=$("#menuToggle");mt.addEventListener("click",()=>{const open=menu.classList.toggle("open");mt.setAttribute("aria-expanded",String(open));});$$("nav a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");mt.setAttribute("aria-expanded","false");}));
  let resizeTimer;window.addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(drawMain,100);});
  renderStrategy("long");refresh();renderJournal();
})();