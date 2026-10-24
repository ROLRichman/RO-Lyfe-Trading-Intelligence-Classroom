(() => {
"use strict";
const $=s=>document.querySelector(s);
const API="https://ykmdyfbklvuoseqdjnxy.supabase.co/functions/v1/market-data";
const ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWR5ZmJrbHZ1b3NlcWRqbnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODk5OTQsImV4cCI6MjEwODM2NTk5NH0._YEZj2GSnPcLGXmwgj98V_JzXdJIhTmOFoAH9BSia2I";
const defaults={stocks:[{symbol:"AAPL",name:"Apple"},{symbol:"NVDA",name:"NVIDIA"},{symbol:"TSLA",name:"Tesla"},{symbol:"AMD",name:"AMD"},{symbol:"SPY",name:"S&P 500 ETF"},{symbol:"MSFT",name:"Microsoft"}],crypto:[{symbol:"BTC-USD",name:"Bitcoin",api:"BTC"},{symbol:"ETH-USD",name:"Ethereum",api:"ETH"},{symbol:"SOL-USD",name:"Solana",api:"SOL"},{symbol:"XRP-USD",name:"XRP",api:"XRP"},{symbol:"LINK-USD",name:"Chainlink",api:"LINK"},{symbol:"HYPE-USD",name:"Hyperliquid",api:"HYPE"}]};
const loadLists=()=>{try{const x=JSON.parse(localStorage.getItem("rolyfe-chart-watchlists"));if(x&&x.stocks&&x.crypto)return x;}catch(e){}return JSON.parse(JSON.stringify(defaults));};
let lists=loadLists(),activeList="stocks",current="AAPL",interval="1d",quotes={},chartObj=null,candleSeries=null,volumeSeries=null,resizeObserver=null,loadSequence=0;
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:n<1?5:2}):"—";
const saveLists=()=>{try{localStorage.setItem("rolyfe-chart-watchlists",JSON.stringify(lists));}catch(e){}};
function symbolForApi(symbol){const s=symbol.trim().toUpperCase();if(/^[A-Z0-9.^_-]+$/.test(s))return s;return s.split(":").pop();}
function candleSymbolForApi(symbol){const s=symbolForApi(symbol);const crypto=s.match(/^([A-Z0-9]+)-USD$/);return crypto?"X:"+crypto[1]+"USD":s;}
function setupChart(){const root=$("#tvChart");root.innerHTML="";if(!window.LightweightCharts){root.innerHTML='<div class="loading">Chart library could not load. Check your connection and reload.</div>';$("#chartStatus").textContent="CHART LIBRARY ERROR";return false;}
chartObj=LightweightCharts.createChart(root,{width:root.clientWidth,height:root.clientHeight,layout:{background:{type:"solid",color:"#05070b"},textColor:"#b8c9dc"},grid:{vertLines:{color:"#15202d"},horzLines:{color:"#15202d"}},rightPriceScale:{borderColor:"#29384b"},timeScale:{borderColor:"#29384b",timeVisible:true,secondsVisible:false},crosshair:{mode:LightweightCharts.CrosshairMode.Normal},handleScroll:true,handleScale:true});
candleSeries=chartObj.addCandlestickSeries({upColor:"#50e0a2",downColor:"#ff7186",borderUpColor:"#50e0a2",borderDownColor:"#ff7186",wickUpColor:"#50e0a2",wickDownColor:"#ff7186"});
volumeSeries=chartObj.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"volume",lastValueVisible:false,priceLineVisible:false});
chartObj.priceScale("volume").applyOptions({scaleMargins:{top:.82,bottom:0},borderVisible:false});
chartObj.timeScale().fitContent();
if(resizeObserver)resizeObserver.disconnect();resizeObserver=new ResizeObserver(()=>{if(chartObj)chartObj.applyOptions({width:root.clientWidth,height:root.clientHeight});});resizeObserver.observe(root);
return true;}
async function loadBars(){const seq=++loadSequence;$("#chartStatus").textContent="LOADING CANDLES";$("#chartMeta").textContent="Requesting "+interval+" bars from Tickerbot…";
if(!chartObj&&!setupChart())return;
const ticker=candleSymbolForApi(current);
try{const url=API+"?provider=tickerbot&symbol="+encodeURIComponent(ticker)+"&interval="+encodeURIComponent(interval)+"&limit=300";const r=await fetch(url,{headers:{apikey:ANON,Authorization:"Bearer "+ANON,Accept:"application/json"},cache:"no-store"});const d=await r.json();if(seq!==loadSequence)return;if(!r.ok)throw Error(d.error||d.message||("HTTP "+r.status));if(!Array.isArray(d.bars)||!d.bars.length)throw Error("No candles returned for this symbol and timeframe.");
const bars=d.bars.map(b=>({time:Math.floor(Number(b.t)/1000),open:Number(b.o),high:Number(b.h),low:Number(b.l),close:Number(b.c),volume:Number(b.v)||0})).filter(b=>Number.isFinite(b.time)&&Number.isFinite(b.open)&&Number.isFinite(b.high)&&Number.isFinite(b.low)&&Number.isFinite(b.close)).sort((a,b)=>a.time-b.time);
if(!bars.length)throw Error("Provider returned no valid OHLCV bars.");
candleSeries.setData(bars.map(({time,open,high,low,close})=>({time,open,high,low,close})));
volumeSeries.setData(bars.map(b=>({time:b.time,value:b.volume,color:b.close>=b.open?"rgba(80,224,162,.38)":"rgba(255,113,134,.38)"})));
chartObj.timeScale().fitContent();$("#chartStatus").textContent="CANDLES LOADED";const last=bars[bars.length-1];$("#chartMeta").textContent="Tickerbot · "+bars.length+" candles · "+interval+" · Last close "+fmt(last.close)+" · "+new Date(last.time*1000).toLocaleString()+" · "+(d.coverage||"coverage not supplied");
}catch(e){if(seq!==loadSequence)return;$("#chartStatus").textContent="DATA UNAVAILABLE";$("#chartMeta").textContent="Tickerbot candle request failed: "+e.message;$("#tvChart").dataset.error=e.message;}}
function chart(symbol){current=symbolForApi(symbol);$("#symbolSearch").value=current;$("#chartHeading").textContent=current;renderList();loadBars();showQuote(findItem(current)).catch(()=>{});}
function findItem(symbol){for(const group of Object.values(lists)){const x=group.find(a=>a.symbol===symbol||a.symbol===symbolForApi(symbol));if(x)return x;}return {symbol,name:symbol.split(":").pop()};}
async function getQuote(item){const crypto=Boolean(item.api)||/-USD$/.test(item.symbol);let endpoint;if(crypto){const api=item.api||item.symbol.split("-")[0];endpoint=API+"?provider=coingecko&symbol="+encodeURIComponent(api);}else{endpoint=API+"?provider=finnhub&symbol="+encodeURIComponent(symbolForApi(item.symbol));}
const r=await fetch(endpoint,{headers:{apikey:ANON,Authorization:"Bearer "+ANON,Accept:"application/json"},cache:"no-store"});const d=await r.json();if(!r.ok||!Number.isFinite(d.price)||d.price<=0)throw Error(d.error||"Quote unavailable");return {price:d.price,change:typeof d.changePercent24h==="number"?d.changePercent24h:(typeof d.changePercent==="number"?d.changePercent:parseFloat(d.changePercent)),provider:d.provider,stamp:d.lastUpdatedAt?new Date(d.lastUpdatedAt*1000).toLocaleString():d.timestamp?new Date(d.timestamp*1000).toLocaleString():(d.latestTradingDay||"provider timestamp not supplied")};}
async function showQuote(item){$("#quoteName").textContent=item.symbol+" · "+item.name;$("#quotePrice").textContent="Loading quote…";$("#quoteChange").textContent="Fetching provider response";$("#quoteChange").className="change";$("#quoteMeta").textContent="Quote may be delayed; provider access varies.";
try{const q=await getQuote(item);quotes[item.symbol]=q;$("#quotePrice").textContent=fmt(q.price);$("#quoteChange").textContent=(Number.isFinite(q.change)?(q.change>0?"+":"")+q.change.toFixed(2)+"%  ·  24-hour change":"Change not supplied");$("#quoteChange").className="change "+(q.change<0?"negative":q.change>0?"positive":"");$("#quoteMeta").textContent=q.provider+" · provider response · "+q.stamp+" · Not a guaranteed real-time quote";renderList();}
catch(e){$("#quotePrice").textContent="Quote unavailable";$("#quoteChange").textContent="Provider did not return a usable quote";$("#quoteMeta").textContent="Check ticker, provider entitlement or usage limits. Candle feed is independent.";}}
function renderList(){const root=$("#watchlist");root.innerHTML="";lists[activeList].forEach(item=>{const q=quotes[item.symbol];const b=document.createElement("button");b.type="button";b.className="watch-item"+(item.symbol===current?" active":"");const left=document.createElement("span"),right=document.createElement("span"),sym=document.createElement("strong"),name=document.createElement("small"),price=document.createElement("strong"),delta=document.createElement("small");sym.className="sym";sym.textContent=item.symbol.split(":").pop();name.textContent=item.name;left.append(sym,name);price.className="price";price.textContent=q?fmt(q.price):"—";delta.className="delta"+(q&&q.change<0?" negative":q&&q.change>0?" positive":"");delta.textContent=q&&Number.isFinite(q.change)?(q.change>0?"+":"")+q.change.toFixed(2)+"%":"Quote pending";right.append(price,delta);b.append(left,right);b.addEventListener("click",()=>chart(item.symbol));root.append(b);});}
function addSymbol(raw){let symbol=raw.trim().toUpperCase();if(!symbol)return;if(symbol.includes(":"))symbol=symbol.split(":").pop();if(!/^[A-Z0-9.^_-]{1,20}$/.test(symbol))return;const list=activeList==="crypto"?lists.crypto:lists.stocks;if(list.some(x=>x.symbol===symbol)){chart(symbol);return;}const item={symbol,name:symbol};list.push(item);saveLists();renderList();chart(symbol);}
$("#loadSymbol").addEventListener("click",()=>chart($("#symbolSearch").value.trim()||"AAPL"));
$("#symbolSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();chart($("#symbolSearch").value.trim());}});
document.querySelectorAll("[data-symbol]").forEach(b=>b.addEventListener("click",()=>chart(b.dataset.symbol)));
document.querySelectorAll("[data-list]").forEach(b=>b.addEventListener("click",()=>{activeList=b.dataset.list;document.querySelectorAll("[data-list]").forEach(x=>x.classList.toggle("active",x===b));renderList();}));
document.querySelectorAll("[data-interval]").forEach(b=>b.addEventListener("click",()=>{interval=b.dataset.interval;document.querySelectorAll("[data-interval]").forEach(x=>x.classList.toggle("active",x===b));loadBars();}));
$("#refreshBars").addEventListener("click",loadBars);
$("#addForm").addEventListener("submit",e=>{e.preventDefault();addSymbol($("#addSymbol").value);$("#addSymbol").value="";});
const sidebarToggle=$("#toggleSidebar"),sidebarBackdrop=$("#sidebarBackdrop"),layout=$(".layout");
function setSidebar(open){layout.classList.toggle("sidebar-open",open);sidebarToggle.setAttribute("aria-expanded",String(open));sidebarToggle.textContent=open?"Close watchlist ✕":"☰ Watchlist";sidebarBackdrop.hidden=!open;}
sidebarToggle.addEventListener("click",()=>setSidebar(!layout.classList.contains("sidebar-open")));
sidebarBackdrop.addEventListener("click",()=>setSidebar(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape")setSidebar(false);});
renderList();chart(current);setInterval(()=>{loadBars();showQuote(findItem(current)).catch(()=>{});},60000);
})();