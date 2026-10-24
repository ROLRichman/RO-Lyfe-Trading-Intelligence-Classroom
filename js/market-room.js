
(() => {
  "use strict";
  const $ = (selector, root=document) => root.querySelector(selector);
  const data = {
    stocks: [
      {symbol:"AAPL",name:"Apple · sample",bias:"UPTREND",seed:13,base:100},
      {symbol:"NVDA",name:"NVIDIA · sample",bias:"MIXED",seed:27,base:80},
      {symbol:"TSLA",name:"Tesla · sample",bias:"PULLBACK",seed:41,base:120},
      {symbol:"SPY",name:"S&P 500 ETF · sample",bias:"RANGE",seed:59,base:105},
      {symbol:"AMD",name:"AMD · sample",bias:"UPTREND",seed:73,base:90}
    ],
    crypto: [
      {symbol:"BTC-USD",name:"Bitcoin · sample",bias:"UPTREND",seed:19,base:105},
      {symbol:"ETH-USD",name:"Ethereum · sample",bias:"MIXED",seed:31,base:85},
      {symbol:"SOL-USD",name:"Solana · sample",bias:"PULLBACK",seed:47,base:95},
      {symbol:"XRP-USD",name:"XRP · sample",bias:"RANGE",seed:61,base:70},
      {symbol:"LINK-USD",name:"Chainlink · sample",bias:"MIXED",seed:83,base:78},
      {symbol:"HYPE",name:"Hyperliquid · live quote available",bias:"MIXED",seed:97,base:75}
    ],
    futures: [
      {symbol:"ES",name:"E-mini S&P 500 · sample",bias:"MIXED",seed:23,base:110},
      {symbol:"NQ",name:"E-mini Nasdaq-100 · sample",bias:"UPTREND",seed:37,base:125},
      {symbol:"YM",name:"E-mini Dow · sample",bias:"RANGE",seed:53,base:100},
      {symbol:"RTY",name:"E-mini Russell 2000 · sample",bias:"PULLBACK",seed:67,base:88},
      {symbol:"CL",name:"Crude oil · sample",bias:"MIXED",seed:89,base:75}
    ]
  };
  let selectedClass = "stocks";
  let selectedIndex = 0;
  let refreshSeed = 0;
  const money = n => Number.isFinite(n) ? n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:4}) : "—";
  // Public client credentials are intentionally limited to the project's legacy anon key.
  // Provider API keys remain in Supabase Edge Function Secrets.
  const marketDataConfig = {
    url: "https://ykmdyfbklvuoseqdjnxy.supabase.co/functions/v1/market-data",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWR5ZmJrbHZ1b3NlcWRqbnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODk5OTQsImV4cCI6MjEwODM2NTk5NH0._YEZj2GSnPcLGXmwgj98V_JzXdJIhTmOFoAH9BSia2I"
  };
  const cryptoSymbols = { "BTC-USD":"BTC", "ETH-USD":"ETH", "SOL-USD":"SOL", "XRP-USD":"XRP", "LINK-USD":"LINK", "HYPE":"HYPE" };
  let liveCryptoStatus = "Live crypto quotes have not been loaded yet.";
  function ensureLiveDataStatus() {
    let status = $("#mrLiveDataStatus");
    if (status) return status;
    const list = $("#mrSymbolList");
    if (!list) return null;
    status = document.createElement("p");
    status.id = "mrLiveDataStatus";
    status.className = "mr-small";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.style.marginTop = "0.5rem";
    list.insertAdjacentElement("afterend", status);
    return status;
  }
  async function fetchCryptoQuote(symbol) {
    const response = await fetch(marketDataConfig.url + "?provider=coingecko&symbol=" + encodeURIComponent(symbol), {
      method: "GET",
      headers: {
        "apikey": marketDataConfig.anonKey,
        "Authorization": "Bearer " + marketDataConfig.anonKey,
        "Accept": "application/json"
      },
      cache: "no-store"
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || ("Market data request failed (" + response.status + ")."));
    if (payload.provider !== "coingecko" || payload.symbol !== symbol || !Number.isFinite(payload.price) || payload.price <= 0) {
      throw new Error("The provider returned an unexpected quote format.");
    }
    return payload;
  }
  async function loadCryptoQuotes() {
    const status = ensureLiveDataStatus();
    if (selectedClass !== "crypto") {
      if (status) status.textContent = "Live quotes are currently enabled for crypto only. Stock and futures charts remain illustrative.";
      return;
    }
    if (status) status.textContent = "Loading CoinGecko quotes…";
    const quoteResults = await Promise.all(data.crypto.map(async item => {
      const symbol = cryptoSymbols[item.symbol] || item.symbol;
      try { return { symbol: item.symbol, quote: await fetchCryptoQuote(symbol) }; }
      catch (error) { return { symbol: item.symbol, error: error.message || "Quote unavailable." }; }
    }));
    let successes = 0;
    quoteResults.forEach(result => {
      const button = Array.from($("#mrSymbolList")?.querySelectorAll("button") || []).find(node => node.querySelector("strong")?.textContent === result.symbol);
      if (!button) return;
      let quoteLine = button.querySelector(".mr-live-quote");
      if (!quoteLine) {
        quoteLine = document.createElement("small");
        quoteLine.className = "mr-live-quote";
        quoteLine.style.display = "block";
        quoteLine.style.marginTop = "0.2rem";
        button.querySelector("span")?.append(quoteLine);
      }
      if (result.quote) {
        successes++;
        const change = result.quote.changePercent24h;
        quoteLine.textContent = "$" + money(result.quote.price) + (Number.isFinite(change) ? " · " + (change > 0 ? "+" : "") + change.toFixed(2) + "%" : "");
        quoteLine.setAttribute("title", "CoinGecko provider response. Quote may be delayed; last updated " + (result.quote.lastUpdatedAt ? new Date(result.quote.lastUpdatedAt * 1000).toLocaleString() : "time unavailable") + ".");
        quoteLine.style.color = Number.isFinite(change) && change < 0 ? "#ff7787" : "#55e0a3";
      } else {
        quoteLine.textContent = "Live quote unavailable";
        quoteLine.setAttribute("title", result.error);
        quoteLine.style.color = "#ffb86b";
      }
    });
    liveCryptoStatus = successes + " of " + quoteResults.length + " crypto quotes loaded from CoinGecko.";
    if (status) status.textContent = liveCryptoStatus + " Candlestick charts remain illustrative; live historical candles are not connected.";
  }
  function seriesFor(item) {
    let seed = item.seed + refreshSeed * 97;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    let p = item.base;
    const points = [];
    for (let i=0;i<44;i++) {
      const open = p;
      const drift = item.bias === "UPTREND" ? .55 : item.bias === "PULLBACK" ? -.22 : item.bias === "RANGE" ? Math.sin(i/2)*.08 : (i%9<5?.22:-.25);
      const close = Math.max(5,open + drift + (rand()-.48)*2.4);
      const high = Math.max(open,close) + rand()*1.2;
      const low = Math.min(open,close) - rand()*1.1;
      points.push({open,close,high,low}); p=close;
    }
    return points;
  }
  function drawChart(item) {
    const canvas=$("#mrChart"); if(!canvas) return;
    const rect=canvas.getBoundingClientRect(); if(!rect.width || !rect.height) return;
    const ratio=window.devicePixelRatio || 1;
    canvas.width=Math.round(rect.width*ratio); canvas.height=Math.round(rect.height*ratio);
    const ctx=canvas.getContext("2d"); ctx.scale(ratio,ratio);
    const w=rect.width,h=rect.height,pad={l:10,r:42,t:12,b:20};
    ctx.clearRect(0,0,w,h);
    const points=seriesFor(item);
    const min=Math.min(...points.map(x=>x.low)),max=Math.max(...points.map(x=>x.high));
    const y=v=>pad.t+(max-v)/(max-min||1)*(h-pad.t-pad.b);
    const plotW=w-pad.l-pad.r,step=plotW/points.length,cw=Math.max(2,Math.min(8,step*.52));
    ctx.font="10px system-ui";ctx.strokeStyle="#1d3045";ctx.fillStyle="#8fa7c0";ctx.lineWidth=1;
    for(let i=0;i<5;i++){const yy=pad.t+i*(h-pad.t-pad.b)/4;ctx.beginPath();ctx.moveTo(pad.l,yy);ctx.lineTo(w-pad.r,yy);ctx.stroke();ctx.fillText(money(max-i*(max-min)/4),w-pad.r+4,yy+3);}
    points.forEach((p,i)=>{const x=pad.l+(i+.5)*step;const up=p.close>=p.open;ctx.strokeStyle=up?"#55e0a3":"#ff7787";ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y(p.high));ctx.lineTo(x,y(p.low));ctx.stroke();const top=y(Math.max(p.open,p.close)),bh=Math.max(1,Math.abs(y(p.open)-y(p.close)));ctx.fillRect(x-cw/2,top,cw,bh);});
    ctx.fillStyle="#9fb2c8";ctx.fillText("Earlier",pad.l,h-4);ctx.fillText("Latest",w-pad.r-28,h-4);
    $("#mrChartTitle").textContent=item.symbol+" · illustrative chart";
    $("#mrTimeframeTag").textContent=$("#mrTimeframe").value;
    $("#mrChartNote").textContent="Sample series · no live feed";
    const avg=points.slice(-8).reduce((a,p)=>a+p.close,0)/8;
    const last=points[points.length-1].close;
    const trend=last>avg*1.01?"Above recent mean":last<avg*.99?"Below recent mean":"Near recent mean";
    $("#mrTrendMetric").textContent=trend;
    $("#mrMomentumMetric").textContent=last>points[points.length-5].close?"Positive sample":"Mixed / negative";
    $("#mrPosture").textContent=item.bias==="UPTREND"?"TREND STUDY":item.bias==="PULLBACK"?"PULLBACK STUDY":item.bias==="RANGE"?"RANGE STUDY":"WAIT FOR CONFIRMATION";
    $("#mrPostureText").textContent="Illustrative bias only ("+item.bias+"). Confirm higher-timeframe structure, actual price levels, liquidity and invalidation before making a decision.";
  }
  function renderSymbols() {
    const list=$("#mrSymbolList"); if(!list) return;
    list.replaceChildren();
    data[selectedClass].forEach((item,index)=>{
      const button=document.createElement("button");button.type="button";button.className="mr-symbol-btn"+(index===selectedIndex?" active":"");
      button.setAttribute("aria-pressed",String(index===selectedIndex));
      const left=document.createElement("span"),right=document.createElement("span"),strong=document.createElement("strong"),small=document.createElement("small"),bias=document.createElement("span");
      strong.textContent=item.symbol;small.textContent=item.name;bias.className="mr-mini-bias";bias.textContent=item.bias;
      left.append(strong,small);right.append(bias);button.append(left,right);
      button.addEventListener("click",()=>{selectedIndex=index;renderSymbols();drawChart(data[selectedClass][selectedIndex]);});
      list.append(button);
    });
  }
  function renderRisk() {
    const output=$("#mrRiskOutput"); if(!output)return;
    const entry=Number($("#mrEntry").value),stop=Number($("#mrStop").value),units=Number($("#mrShares").value),direction=$("#mrDirection").value;
    if(!(entry>0&&stop>0&&units>0)){output.innerHTML='<p class="mr-small">Enter a planned entry and invalidation level to calculate risk and illustrative target levels.</p>';return;}
    const riskPerUnit=direction==="long"?entry-stop:stop-entry;
    if(!(riskPerUnit>0)){output.innerHTML='<p class="mr-small">Check the levels: a long plan needs the stop below entry; a short plan needs the stop above entry.</p>';return;}
    const totalRisk=riskPerUnit*units;
    const target=(r)=>direction==="long"?entry+r*riskPerUnit:entry-r*riskPerUnit;
    output.innerHTML='<div class="mr-risk-cards">'+
      '<div class="mr-risk-card risk"><small>Planned 1R risk</small><strong>$'+money(totalRisk)+'</strong></div>'+
      '<div class="mr-risk-card target"><small>1R target</small><strong>'+money(target(1))+'</strong></div>'+
      '<div class="mr-risk-card target"><small>2R target</small><strong>'+money(target(2))+'</strong></div>'+
      '<div class="mr-risk-card target"><small>3R target</small><strong>'+money(target(3))+'</strong></div></div>'+
      '<p class="mr-risk-note">Risk per unit: '+money(riskPerUnit)+' · Units: '+units+' · Direction: '+(direction==="long"?"Long":"Short")+'. These are arithmetic levels, not trade recommendations.</p>';
  }
  function init() {
    if(!$("#mrAssetClass"))return;
    $("#mrAssetClass").addEventListener("change",e=>{selectedClass=e.target.value;selectedIndex=0;renderSymbols();drawChart(data[selectedClass][selectedIndex]);});
    $("#mrTimeframe").addEventListener("change",()=>drawChart(data[selectedClass][selectedIndex]));
    $("#mrRefresh").addEventListener("click",()=>{refreshSeed++;drawChart(data[selectedClass][selectedIndex]);});
    $("#mrRiskForm").addEventListener("submit",e=>{e.preventDefault();renderRisk();});
    ["mrEntry","mrStop","mrShares","mrDirection"].forEach(id=>$("#"+id).addEventListener("input",renderRisk));
    renderSymbols();drawChart(data[selectedClass][selectedIndex]);
    loadCryptoQuotes();
    $("#mrAssetClass").addEventListener("change", () => loadCryptoQuotes());
    $("#mrRefresh").addEventListener("click", () => loadCryptoQuotes());
    window.addEventListener("resize",()=>drawChart(data[selectedClass][selectedIndex]));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
