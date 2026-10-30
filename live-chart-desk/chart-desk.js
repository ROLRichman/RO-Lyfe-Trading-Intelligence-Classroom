(() => {
"use strict";
const $=s=>document.querySelector(s);
if(new URLSearchParams(location.search).get("embed")==="classroom")document.body.classList.add("classroom-embed");
const API="https://ykmdyfbklvuoseqdjnxy.supabase.co/functions/v1/market-data";
const ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWR5ZmJrbHZ1b3NlcWRqbnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODk5OTQsImV4cCI6MjEwODM2NTk5NH0._YEZj2GSnPcLGXmwgj98V_JzXdJIhTmOFoAH9BSia2I";
const defaults={"stocks":[{"symbol":"AAPL","name":"Apple"},{"symbol":"NVDA","name":"NVIDIA"},{"symbol":"TSLA","name":"Tesla"},{"symbol":"AMD","name":"AMD"},{"symbol":"SPY","name":"S&P 500 ETF"},{"symbol":"MSFT","name":"Microsoft"},{"symbol":"AMZN","name":"Amazon"},{"symbol":"GOOGL","name":"Alphabet A"},{"symbol":"GOOG","name":"Alphabet C"},{"symbol":"META","name":"Meta Platforms"},{"symbol":"NFLX","name":"Netflix"},{"symbol":"AVGO","name":"Broadcom"},{"symbol":"ORCL","name":"Oracle"},{"symbol":"CRM","name":"Salesforce"},{"symbol":"ADBE","name":"Adobe"},{"symbol":"QCOM","name":"Qualcomm"},{"symbol":"INTC","name":"Intel"},{"symbol":"MU","name":"Micron"},{"symbol":"ARM","name":"Arm Holdings"},{"symbol":"SMCI","name":"Super Micro Computer"},{"symbol":"PLTR","name":"Palantir"},{"symbol":"COIN","name":"Coinbase"},{"symbol":"HOOD","name":"Robinhood"},{"symbol":"MSTR","name":"Strategy"},{"symbol":"JPM","name":"JPMorgan Chase"},{"symbol":"BAC","name":"Bank of America"},{"symbol":"WFC","name":"Wells Fargo"},{"symbol":"GS","name":"Goldman Sachs"},{"symbol":"MS","name":"Morgan Stanley"},{"symbol":"V","name":"Visa"},{"symbol":"MA","name":"Mastercard"},{"symbol":"AXP","name":"American Express"},{"symbol":"COST","name":"Costco"},{"symbol":"WMT","name":"Walmart"},{"symbol":"TGT","name":"Target"},{"symbol":"HD","name":"Home Depot"},{"symbol":"LOW","name":"Lowe's"},{"symbol":"NKE","name":"Nike"},{"symbol":"DIS","name":"Disney"},{"symbol":"UBER","name":"Uber"},{"symbol":"ABNB","name":"Airbnb"},{"symbol":"SHOP","name":"Shopify"},{"symbol":"SNOW","name":"Snowflake"},{"symbol":"PANW","name":"Palo Alto Networks"},{"symbol":"CRWD","name":"CrowdStrike"},{"symbol":"NET","name":"Cloudflare"},{"symbol":"DDOG","name":"Datadog"},{"symbol":"IBM","name":"IBM"},{"symbol":"CSCO","name":"Cisco"},{"symbol":"NOW","name":"ServiceNow"},{"symbol":"PYPL","name":"PayPal"},{"symbol":"SQ","name":"Block"},{"symbol":"SOFI","name":"SoFi"},{"symbol":"XOM","name":"Exxon Mobil"},{"symbol":"CVX","name":"Chevron"},{"symbol":"LLY","name":"Eli Lilly"},{"symbol":"JNJ","name":"Johnson & Johnson"},{"symbol":"PFE","name":"Pfizer"},{"symbol":"MRNA","name":"Moderna"},{"symbol":"UNH","name":"UnitedHealth"},{"symbol":"ABBV","name":"AbbVie"},{"symbol":"TMO","name":"Thermo Fisher"},{"symbol":"CAT","name":"Caterpillar"},{"symbol":"DE","name":"Deere"},{"symbol":"BA","name":"Boeing"},{"symbol":"GE","name":"GE Aerospace"},{"symbol":"F","name":"Ford"},{"symbol":"GM","name":"General Motors"},{"symbol":"RIVN","name":"Rivian"},{"symbol":"LCID","name":"Lucid"},{"symbol":"IWM","name":"Russell 2000 ETF"},{"symbol":"QQQ","name":"Nasdaq-100 ETF"},{"symbol":"DIA","name":"Dow Jones ETF"},{"symbol":"VTI","name":"Total US Market ETF"},{"symbol":"GLD","name":"Gold ETF"},{"symbol":"TLT","name":"20+ Year Treasury ETF"}],"crypto":[{"symbol":"BTC-USD","name":"Bitcoin","api":"BTC"},{"symbol":"ETH-USD","name":"Ethereum","api":"ETH"},{"symbol":"SOL-USD","name":"Solana","api":"SOL"},{"symbol":"XRP-USD","name":"XRP","api":"XRP"},{"symbol":"LINK-USD","name":"Chainlink","api":"LINK"},{"symbol":"HYPE-USD","name":"Hyperliquid","api":"HYPE"},{"symbol":"BNB-USD","name":"BNB","api":"BNB"},{"symbol":"ADA-USD","name":"Cardano","api":"ADA"},{"symbol":"DOGE-USD","name":"Dogecoin","api":"DOGE"},{"symbol":"AVAX-USD","name":"Avalanche","api":"AVAX"},{"symbol":"DOT-USD","name":"Polkadot","api":"DOT"},{"symbol":"LTC-USD","name":"Litecoin","api":"LTC"},{"symbol":"BCH-USD","name":"Bitcoin Cash","api":"BCH"},{"symbol":"SUI-USD","name":"Sui","api":"SUI"},{"symbol":"TON-USD","name":"Toncoin","api":"TON"},{"symbol":"TRX-USD","name":"TRON","api":"TRX"},{"symbol":"XLM-USD","name":"Stellar","api":"XLM"},{"symbol":"HBAR-USD","name":"Hedera","api":"HBAR"},{"symbol":"SHIB-USD","name":"Shiba Inu","api":"SHIB"},{"symbol":"PEPE-USD","name":"Pepe","api":"PEPE"},{"symbol":"UNI-USD","name":"Uniswap","api":"UNI"},{"symbol":"AAVE-USD","name":"Aave","api":"AAVE"},{"symbol":"NEAR-USD","name":"NEAR Protocol","api":"NEAR"},{"symbol":"APT-USD","name":"Aptos","api":"APT"},{"symbol":"ARB-USD","name":"Arbitrum","api":"ARB"},{"symbol":"OP-USD","name":"Optimism","api":"OP"},{"symbol":"ICP-USD","name":"Internet Computer","api":"ICP"},{"symbol":"FIL-USD","name":"Filecoin","api":"FIL"},{"symbol":"ATOM-USD","name":"Cosmos","api":"ATOM"},{"symbol":"ETC-USD","name":"Ethereum Classic","api":"ETC"},{"symbol":"XMR-USD","name":"Monero","api":"XMR"},{"symbol":"INJ-USD","name":"Injective","api":"INJ"},{"symbol":"RENDER-USD","name":"Render","api":"RENDER"},{"symbol":"FET-USD","name":"Artificial Superintelligence Alliance","api":"FET"},{"symbol":"TAO-USD","name":"Bittensor","api":"TAO"},{"symbol":"SEI-USD","name":"Sei","api":"SEI"},{"symbol":"TIA-USD","name":"Celestia","api":"TIA"},{"symbol":"IMX-USD","name":"Immutable","api":"IMX"},{"symbol":"GRT-USD","name":"The Graph","api":"GRT"},{"symbol":"MKR-USD","name":"Maker","api":"MKR"},{"symbol":"PENDLE-USD","name":"Pendle","api":"PENDLE"},{"symbol":"ONDO-USD","name":"Ondo","api":"ONDO"},{"symbol":"JUP-USD","name":"Jupiter","api":"JUP"},{"symbol":"WIF-USD","name":"dogwifhat","api":"WIF"},{"symbol":"BONK-USD","name":"Bonk","api":"BONK"},{"symbol":"FLOKI-USD","name":"Floki","api":"FLOKI"},{"symbol":"ALGO-USD","name":"Algorand","api":"ALGO"},{"symbol":"VET-USD","name":"VeChain","api":"VET"},{"symbol":"RUNE-USD","name":"THORChain","api":"RUNE"},{"symbol":"CRV-USD","name":"Curve DAO","api":"CRV"}]};
const loadLists=()=>{try{const x=JSON.parse(localStorage.getItem("rolyfe-chart-watchlists"));if(x&&x.stocks&&x.crypto){for(const group of ["stocks","crypto"]){const seen=new Set(x[group].map(item=>item.symbol));defaults[group].forEach(item=>{if(!seen.has(item.symbol))x[group].push({...item});});}return x;}}catch(e){}return JSON.parse(JSON.stringify(defaults));};
let lists=loadLists(),activeList="stocks",current="AAPL",interval="1d",candleStyle="standard",quotes={},chartObj=null,candleSeries=null,volumeSeries=null,vwapSeries=null,maSeries={},resizeObserver=null,loadSequence=0,latestBars=[];
const requestedInterval=(new URLSearchParams(location.search).get("interval")||"1d").toLowerCase();if(["1d","4h","1h","15m","5m"].includes(requestedInterval))interval=requestedInterval;
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:n<1?5:2}):"—";
const saveLists=()=>{try{localStorage.setItem("rolyfe-chart-watchlists",JSON.stringify(lists));}catch(e){}};
function symbolForApi(symbol){const s=symbol.trim().toUpperCase();if(/^[A-Z0-9.^_-]+$/.test(s))return s;return s.split(":").pop();}
function candleSymbolForApi(symbol){const s=symbolForApi(symbol);const crypto=s.match(/^([A-Z0-9]+)-USD$/);return crypto?"X:"+crypto[1]+"USD":s;}
function setupChart(){const root=$("#tvChart");root.innerHTML="";if(!window.LightweightCharts){root.innerHTML='<div class="loading">Chart library could not load. Check your connection and reload.</div>';$("#chartStatus").textContent="CHART LIBRARY ERROR";return false;}
chartObj=LightweightCharts.createChart(root,{width:root.clientWidth,height:root.clientHeight,layout:{background:{type:"solid",color:"#05070b"},textColor:"#b8c9dc"},grid:{vertLines:{color:"#15202d"},horzLines:{color:"#15202d"}},rightPriceScale:{borderColor:"#29384b"},timeScale:{borderColor:"#29384b",timeVisible:true,secondsVisible:false},crosshair:{mode:LightweightCharts.CrosshairMode.Normal},handleScroll:true,handleScale:true});
candleSeries=chartObj.addCandlestickSeries({upColor:"#50e0a2",downColor:"#ff7186",borderUpColor:"#50e0a2",borderDownColor:"#ff7186",wickUpColor:"#50e0a2",wickDownColor:"#ff7186"});
volumeSeries=chartObj.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"volume",lastValueVisible:false,priceLineVisible:false});vwapSeries=chartObj.addLineSeries({color:"#f7d46a",lineWidth:2,title:"VWAP",priceLineVisible:false,lastValueVisible:true});const maColors={"5":"#f6c453","10":"#55d6be","20":"#6ea8fe","50":"#c1a5ff","200":"#ff8c69"};[5,10,20,50,200].forEach(n=>{maSeries[n]=chartObj.addLineSeries({color:maColors[n],lineWidth:n===200?3:2,title:"EMA "+n,priceLineVisible:false,lastValueVisible:true});});
chartObj.priceScale("volume").applyOptions({scaleMargins:{top:.82,bottom:0},borderVisible:false});
chartObj.timeScale().fitContent();
if(resizeObserver)resizeObserver.disconnect();resizeObserver=new ResizeObserver(()=>{if(chartObj)chartObj.applyOptions({width:root.clientWidth,height:root.clientHeight});});resizeObserver.observe(root);
return true;}
function toHeikinAshi(bars){let previousOpen=null,previousClose=null;return bars.map((b)=>{const close=(b.open+b.high+b.low+b.close)/4;const open=previousOpen===null?(b.open+b.close)/2:(previousOpen+previousClose)/2;const high=Math.max(b.high,open,close);const low=Math.min(b.low,open,close);previousOpen=open;previousClose=close;return {time:b.time,open,high,low,close};});}
function renderCandles(){if(!candleSeries||!latestBars.length)return;const data=candleStyle==="heikinashi"?toHeikinAshi(latestBars):latestBars.map(({time,open,high,low,close})=>({time,open,high,low,close}));candleSeries.setData(data);const note=$("#candleStyleNote");if(note)note.textContent=candleStyle==="heikinashi"?"Heikin-Ashi smooths candles for trend reading; displayed OHLC values are synthetic, not executable prices.":"Standard candles show actual open, high, low and close.";const meta=$("#chartMeta");if(meta&&latestBars.length){const last=latestBars[latestBars.length-1];meta.textContent="Tickerbot · "+latestBars.length+" candles · "+interval+" · "+(candleStyle==="heikinashi"?"Heikin-Ashi view · actual last close ":"Standard candles · last close ")+fmt(last.close)+" · "+new Date(last.time*1000).toLocaleString();}}
async function loadBars(){const seq=++loadSequence;$("#chartStatus").textContent="LOADING CANDLES";$("#chartMeta").textContent="Requesting "+interval+" bars from Tickerbot…";
if(!chartObj&&!setupChart())return;
const ticker=candleSymbolForApi(current);
try{const url=API+"?provider=tickerbot&symbol="+encodeURIComponent(ticker)+"&interval="+encodeURIComponent(interval)+"&limit=300";const r=await fetch(url,{headers:{apikey:ANON,Authorization:"Bearer "+ANON,Accept:"application/json"},cache:"no-store"});const d=await r.json();if(seq!==loadSequence)return;if(!r.ok)throw Error(d.error||d.message||("HTTP "+r.status));if(!Array.isArray(d.bars)||!d.bars.length)throw Error("No candles returned for this symbol and timeframe.");
const bars=d.bars.map(b=>({time:Math.floor(Number(b.t)/1000),open:Number(b.o),high:Number(b.h),low:Number(b.l),close:Number(b.c),volume:Number(b.v)||0})).filter(b=>Number.isFinite(b.time)&&Number.isFinite(b.open)&&Number.isFinite(b.high)&&Number.isFinite(b.low)&&Number.isFinite(b.close)).sort((a,b)=>a.time-b.time);
if(!bars.length)throw Error("Provider returned no valid OHLCV bars.");
latestBars=bars;renderCandles();
volumeSeries.setData(bars.map(b=>({time:b.time,value:b.volume,color:b.close>=b.open?"rgba(80,224,162,.38)":"rgba(255,113,134,.38)"})));
chartObj.timeScale().fitContent();renderMovingAverages();renderIndicator();$("#chartStatus").textContent="CANDLES LOADED";const last=bars[bars.length-1];renderCandles();$("#chartMeta").textContent+=" · "+(d.coverage||"coverage not supplied");
}catch(e){if(seq!==loadSequence)return;latestBars=[];renderIndicator();$("#chartStatus").textContent="DATA UNAVAILABLE";$("#chartMeta").textContent="Tickerbot candle request failed: "+e.message;$("#tvChart").dataset.error=e.message;}}

function renderMovingAverages(){
const host=$("#maReadout");if(!chartObj||!latestBars.length||!host)return;
const closes=latestBars.map(b=>b.close),labels=[];
[5,10,20,50,200].forEach(n=>{
 let p=null,k=2/(n+1);const values=closes.map((v,i)=>{p=p===null?v:v*k+p*(1-k);return i<n-1?null:p;});
 const control=Array.from(document.querySelectorAll(".ma-toggle")).find(el=>Number(el.value)===n),enabled=control?control.checked:n!==200,s=maSeries[n];
 if(!s)return;if(enabled){s.applyOptions({visible:true});s.setData(latestBars.map((b,i)=>({time:b.time,value:values[i]})).filter(x=>Number.isFinite(x.value)));if(values[values.length-1]!=null)labels.push("EMA "+n+" "+fmt(values[values.length-1]));}
 else{s.setData([]);s.applyOptions({visible:false});}
});
const on=$("#vwapToggle")?$("#vwapToggle").checked:true,intraday=!["1d","1w","1mo"].includes(interval);
if(vwapSeries){
 if(on&&intraday){
  let pv=0,vv=0,session="";const crypto=/-USD$/.test(current);
  const points=latestBars.map(b=>{const key=new Date(b.time*1000).toLocaleDateString("en-US",{timeZone:crypto?"UTC":"America/New_York"});if(key!==session){pv=0;vv=0;session=key;}const tp=(b.high+b.low+b.close)/3,volume=Math.max(0,Number(b.volume)||0);pv+=tp*volume;vv+=volume;return {time:b.time,value:vv?pv/vv:null};}).filter(p=>Number.isFinite(p.value));
  vwapSeries.applyOptions({visible:true});vwapSeries.setData(points);if(points.length)labels.push("VWAP "+fmt(points[points.length-1].value));
 }else{vwapSeries.setData([]);vwapSeries.applyOptions({visible:false});if(on&&!intraday)labels.push("VWAP needs intraday bars (4H/1H/15m/5m)");}
}
host.textContent=labels.length?labels.join(" · "):"Turn on an EMA or VWAP overlay to show it over price.";
}
function optionMoney(value){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(value);}
function renderOptionLadder(){
 const host=$("#optionLadderRows"),error=$("#optionLadderError"),underlying=$("#optionUnderlying");
 if(!host||!error)return;
 if(underlying)underlying.textContent=current||"—";
 const entry=Number($("#optEntry")?.value),stop=Number($("#optStop")?.value),qty=Number($("#optQty")?.value),budget=Number($("#optBudget")?.value);
 const type=$("#optType")?.value||"Call",strike=$("#optStrike")?.value,expiry=$("#optExpiry")?.value;
 const valid=Number.isFinite(entry)&&entry>0&&Number.isFinite(stop)&&stop>0&&stop<entry&&Number.isInteger(qty)&&qty>=1&&Number.isFinite(budget)&&budget>=0;
 if(!valid){
  error.hidden=false;error.textContent="Enter a positive entry premium, a stop premium below entry, at least 1 whole contract, and a non-negative risk budget.";
  ["optDebit","optRisk","optRiskPct","optMaxQty"].forEach(id=>{const el=$("#"+id);if(el)el.textContent="—";});
  host.innerHTML='<tr><td colspan="5">Correct the premium, stop, contract quantity and risk budget to calculate the bracket ladder.</td></tr>';
  $("#optionBracketText").textContent="No valid bracket plan yet.";
  return;
 }
 error.hidden=true;
 const riskPerShare=entry-stop,riskPerContract=riskPerShare*100,debit=entry*100*qty,risk=riskPerContract*qty,riskPct=debit?risk/debit*100:0,maxQty=riskPerContract>0?Math.floor(budget/riskPerContract):0;
 $("#optDebit").textContent=optionMoney(debit);$("#optRisk").textContent=optionMoney(risk);$("#optRiskPct").textContent=riskPct.toFixed(1)+"%";$("#optMaxQty").textContent=String(maxQty);
 const overBudget=risk>budget;
 error.hidden=!overBudget;
 error.textContent=overBudget
  ?"RISK BUDGET EXCEEDED: current contracts risk "+optionMoney(risk)+" against a "+optionMoney(budget)+" budget. At this stop distance, the budget supports up to "+maxQty+" contract(s). Reduce quantity or revise the plan."
  :"";
 const multiples=[1,2,3,4],base=Math.floor(qty/4),remainder=qty%4;
 const levels=multiples.map((r,i)=>({r,qty:base+(i<remainder?1:0),premium:entry+r*riskPerShare,perContract:r*riskPerContract}));
 host.innerHTML=levels.map((v,i)=>'<tr><td><strong>'+(i===3?'4R · Runner':v.r+'R · Target '+v.r)+'</strong></td><td>'+optionMoney(v.premium)+'</td><td>'+v.qty+'</td><td>'+optionMoney(v.perContract)+'</td><td>'+optionMoney(v.perContract*v.qty)+'</td></tr>').join("");
 const optionLabel=(strike?"$"+Number(strike).toFixed(2)+" ":"")+" "+(expiry||"expiration TBD");
 $("#optionBracketText").textContent=(overBudget?"⚠ RISK BUDGET EXCEEDED · ":"")+"Underlying "+current+" · "+type+" · "+optionLabel+" | Entry premium "+optionMoney(entry)+" | Protective stop "+optionMoney(stop)+" | Estimated total debit "+optionMoney(debit)+" | Estimated stop loss "+optionMoney(risk)+" | Planned risk budget "+optionMoney(budget)+". Stage limit exits: "+levels.map(v=>v.r+"R at "+optionMoney(v.premium)+" ("+v.qty+" contract"+(v.qty===1?"":"s")+")").join("; ")+".";
}
function renderIndicator(){
const host=$("#indicatorChart"),readout=$("#indicatorReadout"),mode=$("#indicatorSelect")?.value||"rsi";
if(!host||!readout)return;
host.innerHTML="";
if(latestBars.length<20){
 host.innerHTML='<div class="loading">This study needs more historical candles for the selected symbol and timeframe.</div>';
 readout.textContent="Insufficient historical bars";return;
}
const bars=latestBars,cl=bars.map(b=>b.close),hi=bars.map(b=>b.high),lo=bars.map(b=>b.low),vol=bars.map(b=>Math.max(0,Number(b.volume)||0));
const mean=a=>a.reduce((s,v)=>s+v,0)/Math.max(1,a.length);
const sma=(a,n)=>a.map((v,i)=>i<n-1?null:mean(a.slice(i-n+1,i+1)));
const ema=(a,n)=>{let p=null,k=2/(n+1);return a.map((v,i)=>{if(v===null||!Number.isFinite(v))return null;p=p===null?v:v*k+p*(1-k);return i<n-1?null:p;});};
const tr=bars.map((b,i)=>i===0?b.high-b.low:Math.max(b.high-b.low,Math.abs(b.high-bars[i-1].close),Math.abs(b.low-bars[i-1].close)));
const atrValues=sma(tr,14);
let vals=[],guides=[],label="",color="#78a9ff",suffix="",modeText="",histogram=false;
if(mode==="rsi"){
 label="RSI (14)";guides=[30,70];
 let gain=0,loss=0;
 vals=cl.map((v,i)=>{if(i===0)return null;const d=v-cl[i-1];if(i<=14){gain+=Math.max(d,0)/14;loss+=Math.max(-d,0)/14;if(i<14)return null;}else{gain=(gain*13+Math.max(d,0))/14;loss=(loss*13+Math.max(-d,0))/14;}return loss===0?100:100-100/(1+gain/loss);});
}else if(mode==="stoch"){
 label="Slow Stochastic (14,3)";guides=[20,80];color="#55e0a3";
 const raw=bars.map((b,i)=>{if(i<13)return null;const h=Math.max(...hi.slice(i-13,i+1)),l=Math.min(...lo.slice(i-13,i+1));return h===l?50:100*(b.close-l)/(h-l);});
 vals=raw.map((v,i)=>i<15||raw.slice(i-2,i+1).some(x=>x===null)?null:mean(raw.slice(i-2,i+1)));
}else if(mode==="macd"){
 label="MACD Histogram (12,26,9)";guides=[0];color="#c1a5ff";histogram=true;
 const fast=ema(cl,12),slow=ema(cl,26),line=fast.map((v,i)=>v===null||slow[i]===null?null:v-slow[i]),signal=ema(line,9);
 vals=line.map((v,i)=>v===null||signal[i]===null?null:v-signal[i]);
}else if(mode==="cci"){
 label="CCI (20)";guides=[-100,100];color="#f4c66b";
 vals=bars.map((b,i)=>{if(i<19)return null;const t=bars.slice(i-19,i+1).map(x=>(x.high+x.low+x.close)/3),avg=mean(t),dev=mean(t.map(x=>Math.abs(x-avg)));return dev===0?0:((b.high+b.low+b.close)/3-avg)/(.015*dev);});
}else if(mode==="atr"){
 label="ATR (14)";color="#f4c66b";
 vals=atrValues;
}else if(mode==="adx"){
 label="ADX (14)";guides=[20,25,40];color="#55e0a3";
 const plus=bars.map((b,i)=>i===0?0:Math.max(0,b.high-bars[i-1].high>bars[i-1].low-b.low?b.high-bars[i-1].high:0));
 const minus=bars.map((b,i)=>i===0?0:Math.max(0,bars[i-1].low-b.low> b.high-bars[i-1].high?bars[i-1].low-b.low:0));
 const pAvg=sma(plus,14),mAvg=sma(minus,14);
 const dx=bars.map((b,i)=>{if(!atrValues[i]||pAvg[i]===null||mAvg[i]===null)return null;const p=100*pAvg[i]/atrValues[i],m=100*mAvg[i]/atrValues[i],sum=p+m;return sum?100*Math.abs(p-m)/sum:null;});
 vals=sma(dx.map(v=>v===null?0:v),14).map((v,i)=>i<26?null:v);
}else if(mode==="bollinger"){
 label="Bollinger %B (20,2)";guides=[0,50,100];color="#78a9ff";
 vals=bars.map((b,i)=>{if(i<19)return null;const w=cl.slice(i-19,i+1),avg=mean(w),sd=Math.sqrt(mean(w.map(x=>(x-avg)*(x-avg)))),u=avg+2*sd,l=avg-2*sd;return u===l?50:100*(b.close-l)/(u-l);});
}else if(mode==="obv"){
 label="On-Balance Volume";color="#55e0a3";
 let total=0;vals=bars.map((b,i)=>{if(i>0){if(b.close>bars[i-1].close)total+=vol[i];else if(b.close<bars[i-1].close)total-=vol[i];}return total;});
}else if(mode==="ttm"){
 label="TTM Squeeze · momentum proxy";guides=[0];color="#c1a5ff";histogram=true;
 const mid=sma(cl,20),atr20=sma(tr,20),ema20=ema(cl,20),states=[];
 vals=bars.map((b,i)=>{if(i<19||mid[i]===null||atr20[i]===null||ema20[i]===null){states.push(null);return null;}const w=cl.slice(i-19,i+1),sd=Math.sqrt(mean(w.map(x=>(x-mid[i])*(x-mid[i])))),bbU=mid[i]+2*sd,bbL=mid[i]-2*sd,kcU=ema20[i]+1.5*atr20[i],kcL=ema20[i]-1.5*atr20[i];states.push(bbU<kcU&&bbL>kcL);return b.close-mid[i];});
 modeText=states[states.length-1]===null?"Squeeze unavailable":states[states.length-1]?"SQUEEZE ON":"SQUEEZE RELEASED";
}else if(mode==="supertrend"){
 label="Supertrend (10,3) direction";guides=[0];color="#55e0a3";histogram=true;
 const atr10=sma(tr,10),upper=[],lower=[],trend=[];
 bars.forEach((b,i)=>{
  if(atr10[i]===null){upper.push(null);lower.push(null);trend.push(null);return;}
  const mid=(b.high+b.low)/2,bu=mid+3*atr10[i],bl=mid-3*atr10[i];
  const fu=i===0||upper[i-1]===null?bu:(bu<upper[i-1]||bars[i-1].close>upper[i-1]?bu:upper[i-1]);
  const fl=i===0||lower[i-1]===null?bl:(bl>lower[i-1]||bars[i-1].close<lower[i-1]?bl:lower[i-1]);
  let direction=i===0||trend[i-1]===null?1:trend[i-1];
  if(direction<0&&b.close>upper[i-1])direction=1;else if(direction>0&&b.close<lower[i-1])direction=-1;
  upper.push(fu);lower.push(fl);trend.push(direction);
 });
 vals=trend;modeText=trend[trend.length-1]===1?"UPTREND":trend[trend.length-1]===-1?"DOWNTREND":"Trend forming";
}else if(mode==="rvol"){
 label="Relative Volume (20)";guides=[1,2,3];color="#f4c66b";suffix="x";
 vals=vol.map((v,i)=>{if(i<20)return null;const avg=mean(vol.slice(i-20,i));return avg>0?v/avg:null;});
}else if(mode==="volume"){
 label="Volume";color="#55e0a3";histogram=true;
 vals=vol;
}
const good=vals.filter(v=>v!==null&&Number.isFinite(v));
if(!good.length){host.textContent="Insufficient data for this study.";readout.textContent="No valid indicator values";return;}
let min=Math.min(...good,...guides),max=Math.max(...good,...guides);
if(["rsi","stoch","bollinger"].includes(mode)){min=0;max=100;}
else if(mode==="supertrend"){min=-1.2;max=1.2;}
else{const span=Math.max(1e-8,max-min);min-=span*.12;max+=span*.12;}
const W=Math.max(280,host.clientWidth||600),H=210,dpr=window.devicePixelRatio||1,cv=document.createElement("canvas");
cv.width=W*dpr;cv.height=H*dpr;cv.style.width="100%";cv.style.height=H+"px";host.append(cv);
const ctx=cv.getContext("2d");ctx.scale(dpr,dpr);ctx.fillStyle="#05070b";ctx.fillRect(0,0,W,H);
const y=v=>12+(max-v)/(max-min)*(H-30);
ctx.font="10px system-ui";ctx.strokeStyle="#253246";ctx.fillStyle="#9fb2c8";ctx.setLineDash([4,4]);
guides.forEach(v=>{ctx.beginPath();ctx.moveTo(34,y(v));ctx.lineTo(W-8,y(v));ctx.stroke();ctx.fillText(String(v),3,y(v)+3);});
ctx.setLineDash([]);
if(histogram){
 const base=guides.includes(0)?y(0):H-18,barW=Math.max(1,(W-44)/vals.length*.62);
 vals.forEach((v,i)=>{if(v===null||!Number.isFinite(v))return;const x=34+i/(vals.length-1)*(W-44),bottom=mode==="volume"?H-18:base;ctx.fillStyle=(mode==="supertrend"?(v>=0?"#55e0a3":"#ff7186"):(v>=0?color:"#ff7186"));ctx.fillRect(x-barW/2,Math.min(y(v),bottom),barW,Math.max(1,Math.abs(bottom-y(v))));});
}else{
 ctx.beginPath();let started=false;
 vals.forEach((v,i)=>{if(v===null||!Number.isFinite(v))return;const x=34+i/(vals.length-1)*(W-44);if(!started){ctx.moveTo(x,y(v));started=true;}else ctx.lineTo(x,y(v));});
 ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();
}
const last=good[good.length-1],display=modeText||last.toLocaleString("en-US",{maximumFractionDigits:3})+suffix;
readout.textContent=label+" · "+display+" · "+bars.length+" bars";
}function chart(symbol,showPopup=true){current=symbolForApi(symbol);$("#symbolSearch").value=current;$("#chartHeading").textContent=current;try{if(window.parent&&window.parent!==window)window.parent.postMessage({type:"rol-live-chart-symbol",symbol:current},location.origin);}catch(e){}if(new URLSearchParams(location.search).get("embed")==="classroom"){try{const parentSelect=window.parent.document.getElementById("classroomSymbol");if(parentSelect){let match=Array.from(parentSelect.options).find(o=>o.value===current);if(!match){match=document.createElement("option");match.value=current;match.textContent=current+" — Custom";parentSelect.add(match);}parentSelect.value=current;}}catch(e){}}renderList();renderOptionLadder();const selected=findItem(current);loadBars();showQuote(selected).catch(()=>{});if(showPopup)openQuotePopup(selected);}
function findItem(symbol){for(const group of Object.values(lists)){const x=group.find(a=>a.symbol===symbol||a.symbol===symbolForApi(symbol));if(x)return x;}return {symbol,name:symbol.split(":").pop()};}
async function getQuote(item){
const crypto=Boolean(item.api)||/-USD$/.test(item.symbol),ticker=crypto?("X:"+((item.api||item.symbol.split("-")[0]).replace(/[^A-Z0-9]/g,""))+"USD"):symbolForApi(item.symbol);
const headers={apikey:ANON,Authorization:"Bearer "+ANON,Accept:"application/json"};
try{
 const rowUrl=API+"?provider=tickerbot-row&symbol="+encodeURIComponent(ticker);
 const rowResponse=await fetch(rowUrl,{headers,cache:"no-store"}),rowJson=await rowResponse.json();
 const row=rowJson&&rowJson.data&&rowJson.data.data?rowJson.data.data:rowJson&&rowJson.data;
 if(rowResponse.ok&&row&&Number.isFinite(Number(row.price))&&Number(row.price)>0){
  return {price:Number(row.price),change:Number.isFinite(Number(row.change_1d_pct))?Number(row.change_1d_pct)*100:NaN,provider:"Tickerbot",stamp:rowJson.asOf||"provider timestamp not supplied",signals:row};
 }
}catch(e){}
let endpoint;
if(crypto){const api=item.api||item.symbol.split("-")[0];endpoint=API+"?provider=coingecko&symbol="+encodeURIComponent(api);}
else{endpoint=API+"?provider=finnhub&symbol="+encodeURIComponent(symbolForApi(item.symbol));}
const r=await fetch(endpoint,{headers,cache:"no-store"});const d=await r.json();
if(!r.ok||!Number.isFinite(d.price)||d.price<=0)throw Error(d.error||"Quote unavailable");
return {price:d.price,change:typeof d.changePercent24h==="number"?d.changePercent24h:(typeof d.changePercent==="number"?d.changePercent:parseFloat(d.changePercent)),provider:d.provider,stamp:d.lastUpdatedAt?new Date(d.lastUpdatedAt*1000).toLocaleString():d.timestamp?new Date(d.timestamp*1000).toLocaleString():(d.latestTradingDay||"provider timestamp not supplied")};
}
let activeQuoteItem=null;
function openQuotePopup(item){activeQuoteItem=item;$("#quotePopup").hidden=false;$("#quotePopupBackdrop").hidden=false;document.body.classList.add("quote-popup-open");$("#quotePopupTitle").textContent=item.symbol+" · "+item.name;$("#popupPrice").textContent="Loading quote…";$("#popupChange").textContent="Fetching provider response";$("#popupMeta").textContent="Requesting provider";$("#popupProvider").textContent="Loading…";$("#popupCoinId").textContent=item.api||item.symbol;$("#popupCoverage").textContent="Checking";if(quotes[item.symbol])paintPopupQuote(item,quotes[item.symbol]);getQuote(item).then(q=>{quotes[item.symbol]=q;notifyParentQuote(item,q);paintPopupQuote(item,q);renderList();}).catch(()=>{$("#popupPrice").textContent="Quote unavailable";$("#popupChange").textContent="Provider did not return a usable quote";$("#popupMeta").textContent="Check symbol, network or provider access.";$("#popupProvider").textContent="No response";$("#popupCoverage").textContent="Unavailable";});updatePopupGreeks();}
function paintPopupQuote(item,q){$("#popupPrice").textContent=fmt(q.price);$("#popupPrice").dataset.price=String(q.price);$("#popupChange").textContent=(Number.isFinite(q.change)?(q.change>0?"+":"")+q.change.toFixed(2)+"% · 24-hour change":"Change not supplied");$("#popupChange").className="change "+(q.change<0?"negative":q.change>0?"positive":"");$("#popupMeta").textContent=q.provider+" · "+q.stamp;$("#popupProvider").textContent=q.provider||"Provider";$("#popupCoinId").textContent=item.api||item.symbol;$("#popupCoverage").textContent="Provider response · verify timestamp";updatePopupGreeks();}
function closeQuotePopup(){ $("#quotePopup").hidden=true;$("#quotePopupBackdrop").hidden=true;document.body.classList.remove("quote-popup-open");}
function normalCdf(x){const a=Math.abs(x),t=1/(1+.2316419*a),d=.3989422804014327*Math.exp(-a*a/2),p=1-d*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return x>=0?p:1-p;}
function normalPdf(x){return .3989422804014327*Math.exp(-x*x/2);}
function updatePopupGreeks(){const q=activeQuoteItem&&quotes[activeQuoteItem.symbol],S=q&&q.price,K=Number($("#popupStrike").value),dte=Number($("#popupDte").value),iv=Number($("#popupIv").value)/100,rate=Number($("#popupRate").value)/100,side=$("#popupSide").value;const ids=["greekDelta","greekGamma","greekVega","greekProb"];if(!S||!Number.isFinite(K)||K<=0||!Number.isFinite(dte)||dte<=0||!Number.isFinite(iv)||iv<=0||!Number.isFinite(rate)){ids.forEach(id=>$("#"+id).textContent="—");$("#greekStatus").textContent="Enter a strike and valid assumptions to calculate estimates.";return;}const T=dte/365,root=Math.sqrt(T),d1=(Math.log(S/K)+(rate+iv*iv/2)*T)/(iv*root),d2=d1-iv*root,dc=normalCdf(d1),delta=side==="call"?dc:dc-1,gamma=normalPdf(d1)/(S*iv*root),vega=S*normalPdf(d1)*root/100,prob=side==="call"?normalCdf(d2):normalCdf(-d2);$("#greekDelta").textContent=delta.toFixed(3);$("#greekGamma").textContent=gamma.toFixed(5);$("#greekVega").textContent=vega.toFixed(3);$("#greekProb").textContent=(prob*100).toFixed(1)+"%";$("#greekStatus").textContent="Black–Scholes estimate · spot "+fmt(S)+" · "+dte+" DTE · "+(iv*100).toFixed(1)+"% assumed IV. Model probability is not a prediction.";}
function notifyParentQuote(item,q){
 try{
  if(window.parent&&window.parent!==window)window.parent.postMessage({
   type:"rol-live-chart-quote",symbol:item.symbol,price:q.price,provider:q.provider,stamp:q.stamp
  },location.origin);
 }catch(e){}
}
async function showQuote(item){$("#quoteName").textContent=item.symbol+" · "+item.name;$("#quotePrice").textContent="Loading quote…";$("#quoteChange").textContent="Fetching provider response";$("#quoteChange").className="change";$("#quoteMeta").textContent="Quote may be delayed; provider access varies.";
try{const q=await getQuote(item);quotes[item.symbol]=q;notifyParentQuote(item,q);$("#quotePrice").textContent=fmt(q.price);$("#quoteChange").textContent=(Number.isFinite(q.change)?(q.change>0?"+":"")+q.change.toFixed(2)+"%  ·  24-hour change":"Change not supplied");$("#quoteChange").className="change "+(q.change<0?"negative":q.change>0?"positive":"");$("#quoteMeta").textContent=q.provider+" · provider response · "+q.stamp+" · Not a guaranteed real-time quote";renderList();}
catch(e){$("#quotePrice").textContent="Quote unavailable";$("#quoteChange").textContent="Provider did not return a usable quote";$("#quoteMeta").textContent="Check ticker, provider entitlement or usage limits. Candle feed is independent.";}}
function renderList(){const root=$("#watchlist");root.innerHTML="";lists[activeList].forEach(item=>{const q=quotes[item.symbol];const b=document.createElement("button");b.type="button";b.className="watch-item"+(item.symbol===current?" active":"");const left=document.createElement("span"),right=document.createElement("span"),sym=document.createElement("strong"),name=document.createElement("small"),price=document.createElement("strong"),delta=document.createElement("small");sym.className="sym";sym.textContent=item.symbol.split(":").pop();name.textContent=item.name;left.append(sym,name);price.className="price";price.textContent=q?fmt(q.price):"—";delta.className="delta"+(q&&q.change<0?" negative":q&&q.change>0?" positive":"");delta.textContent=q&&Number.isFinite(q.change)?(q.change>0?"+":"")+q.change.toFixed(2)+"%":"Quote pending";right.append(price,delta);b.append(left,right);b.addEventListener("click",()=>chart(item.symbol));root.append(b);});}
function addSymbol(raw){let symbol=raw.trim().toUpperCase();if(!symbol)return;if(symbol.includes(":"))symbol=symbol.split(":").pop();if(!/^[A-Z0-9.^_-]{1,20}$/.test(symbol))return;const list=activeList==="crypto"?lists.crypto:lists.stocks;if(list.some(x=>x.symbol===symbol)){chart(symbol);return;}const item={symbol,name:symbol};list.push(item);saveLists();renderList();chart(symbol);}
$("#loadSymbol").addEventListener("click",()=>chart($("#symbolSearch").value.trim()||"AAPL"));
$("#symbolSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();chart($("#symbolSearch").value.trim());}});
document.querySelectorAll("[data-symbol]").forEach(b=>b.addEventListener("click",()=>chart(b.dataset.symbol)));
document.querySelectorAll("[data-list]").forEach(b=>b.addEventListener("click",()=>{activeList=b.dataset.list;document.querySelectorAll("[data-list]").forEach(x=>x.classList.toggle("active",x===b));renderList();}));
document.querySelectorAll("[data-interval]").forEach(b=>b.addEventListener("click",()=>{interval=b.dataset.interval;document.querySelectorAll("[data-interval]").forEach(x=>x.classList.toggle("active",x===b));loadBars();}));
$("#refreshBars").addEventListener("click",loadBars);$("#vwapToggle")?.addEventListener("change",renderMovingAverages);$("#candleStyle").addEventListener("change",e=>{candleStyle=e.target.value;renderCandles();});$("#indicatorSelect").addEventListener("change",renderIndicator);document.querySelectorAll(".ma-toggle").forEach(el=>el.addEventListener("change",renderMovingAverages));document.querySelectorAll("#option-ladder input,#option-ladder select").forEach(el=>{el.addEventListener("input",renderOptionLadder);el.addEventListener("change",renderOptionLadder);});
$("#addForm").addEventListener("submit",e=>{e.preventDefault();addSymbol($("#addSymbol").value);$("#addSymbol").value="";});
$("#closeQuotePopup").addEventListener("click",closeQuotePopup);
$("#openChartQuote")?.addEventListener("click",()=>{const item=findItem(current)||{symbol:current,name:current};openQuotePopup(item);});$("#quotePopupBackdrop").addEventListener("click",closeQuotePopup);document.addEventListener("keydown",e=>{if(e.key==="Escape")closeQuotePopup();});["popupStrike","popupDte","popupIv","popupRate","popupSide"].forEach(id=>$("#"+id).addEventListener("input",updatePopupGreeks));
const sidebarToggle=$("#toggleSidebar"),sidebarBackdrop=$("#sidebarBackdrop"),layout=$(".layout");
function setSidebar(open){layout.classList.toggle("sidebar-open",open);layout.classList.toggle("sidebar-collapsed",window.innerWidth>900&&!open);sidebarToggle.setAttribute("aria-expanded",String(open));sidebarToggle.textContent=open?"Close watchlist ✕":"☰ Watchlist";sidebarBackdrop.hidden=!open;}
sidebarToggle.addEventListener("click",()=>setSidebar(!layout.classList.contains("sidebar-open")));
sidebarBackdrop.addEventListener("click",()=>setSidebar(false));
let swipeStartX=null,swipeStartY=null,swipePointerId=null;
function handleSwipeEnd(x,y){if(swipeStartX===null||swipeStartY===null)return;const dx=x-swipeStartX,dy=y-swipeStartY,startX=swipeStartX;swipeStartX=swipeStartY=null;swipePointerId=null;if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.25)return;const opened=layout.classList.contains("sidebar-open");if(!opened&&dx>0&&startX<Math.min(90,window.innerWidth*.18))setSidebar(true);else if(opened&&dx<0)setSidebar(false);}
document.addEventListener("touchstart",e=>{const t=e.changedTouches&&e.changedTouches[0];if(t){swipeStartX=t.clientX;swipeStartY=t.clientY;}},{passive:true,capture:true});
document.addEventListener("touchend",e=>{const t=e.changedTouches&&e.changedTouches[0];if(t)handleSwipeEnd(t.clientX,t.clientY);},{passive:true,capture:true});
document.addEventListener("pointerdown",e=>{if(e.pointerType==="touch"||e.pointerType==="pen"){swipeStartX=e.clientX;swipeStartY=e.clientY;swipePointerId=e.pointerId;}},{passive:true,capture:true});
document.addEventListener("pointerup",e=>{if(swipePointerId===e.pointerId)handleSwipeEnd(e.clientX,e.clientY);},{passive:true,capture:true});
document.addEventListener("keydown",e=>{if(e.key==="Escape")setSidebar(false);});
const requested=new URLSearchParams(location.search).get("symbol");if(requested)current=symbolForApi(requested);document.querySelectorAll("[data-interval]").forEach(b=>b.classList.toggle("active",b.dataset.interval===interval));
window.ROLyfeChartDesk={
 setSymbol:(symbol)=>{chart(symbol,false);return current;},
 setInterval:(value)=>{const v=String(value||"").toLowerCase();if(!["1d","4h","1h","15m","5m"].includes(v))return false;interval=v;document.querySelectorAll("[data-interval]").forEach(b=>b.classList.toggle("active",b.dataset.interval===interval));loadBars();return true;},
 refresh:loadBars,
 setChartHeight:(height)=>{const h=Math.max(300,Math.min(760,Number(height)||500)),root=$("#tvChart");if(root)root.style.height=h+"px";if(chartObj&&root)chartObj.applyOptions({width:root.clientWidth,height:h});return h;},
 getState:()=>({symbol:current,interval,candles:latestBars.length,lastClose:latestBars.length?latestBars[latestBars.length-1].close:null})
};
window.addEventListener("message",e=>{if(e.origin===location.origin&&e.data&&e.data.type==="rol-set-chart-symbol")chart(e.data.symbol,false);});
renderList();chart(current,false);renderOptionLadder();setInterval(()=>{loadBars();showQuote(findItem(current)).catch(()=>{});},60000);
})();