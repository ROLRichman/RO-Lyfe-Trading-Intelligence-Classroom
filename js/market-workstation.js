/* RO’Lyfe Stage 2 — TradingView chart workstation. No provider secrets are used in browser code. */
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const stocks = [
    "AAPL","AMKR","AMZN","APH","ASX","AVGO","AXP","BAC","BK","C","CAT","CIEN","CLS","COHR","CRDO","CSCO","DAL","DIA","FOXA","FSLR","GE","GLD","GM","GOOGL","GS","GTX","HWM","IBM","INTC","IWM","JCI","JNJ","LITE","LLY","LRCX","M","MA","META","MS","MSFT","MU","NFLX","NVDA","NXT","PLTR","QQQ","REAL","RKLB","ROKU","ROST","RTX","SLV","SNDK","SOFI","SPY","STX","TER","TJX","TSLA","TSM","UUP","VIX","W","WBD","WDC","WMT","XLB","XLC","XLE","XLF","XLI","XLK","XLP","XLU","XLV","XLY",
    "AMD","ABBV","COST","CRM","CRWD","DE","HD","JPM","MCD","MRK","NEE","PANW","PFE","SCHW","SHOP","SNOW","TGT","UNH","UPS","XOM","CVX"
  ];
  const crypto = [
    "BTCUSDT","ETHUSDT","SOLUSDT","XRPUSDT","BNBUSDT","ADAUSDT","AVAXUSDT","DOGEUSDT","LINKUSDT","DOTUSDT",
    "LTCUSDT","BCHUSDT","TRXUSDT","ETCUSDT","ATOMUSDT","FILUSDT","NEARUSDT","ICPUSDT","ARBUSDT","OPUSDT",
    "APTUSDT","HBARUSDT","XLMUSDT","SANDUSDT","AXSUSDT","EGLDUSDT","THETAUSDT","KASUSDT","RENDERUSDT","INJUSDT"
  ];
  const intervals = [{v:"1",t:"1m"},{v:"5",t:"5m"},{v:"10",t:"10m"},{v:"15",t:"15m"},{v:"30",t:"30m"},{v:"60",t:"1h"},{v:"120",t:"2h"},{v:"240",t:"4h"},{v:"D",t:"1D"}];
  const ranges = [{v:"5D",t:"5 days"},{v:"1M",t:"1 month"},{v:"3M",t:"3 months"},{v:"6M",t:"6 months"},{v:"12M",t:"1 year"}];
  const state = {
    stocks:{symbol:"NASDAQ:AAPL",interval:"5",range:"5D",studies:["VWAP@tv-basicstudies","RSI@tv-basicstudies","MACD@tv-basicstudies"]},
    crypto:{symbol:"BINANCE:BTCUSDT",interval:"60",range:"5D",studies:["VWAP@tv-basicstudies","RSI@tv-basicstudies","MACD@tv-basicstudies"]}
  };
  let widgetScriptPromise;
  function loadTradingView(){
    if(window.TradingView) return Promise.resolve();
    if(widgetScriptPromise) return widgetScriptPromise;
    widgetScriptPromise=new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src="https://s3.tradingview.com/tv.js";script.async=true;
      script.onload=()=>window.TradingView?resolve():reject(new Error("TradingView widget did not initialize."));
      script.onerror=()=>reject(new Error("TradingView chart script could not load. Check your connection or content blockers."));
      document.head.appendChild(script);
    });
    return widgetScriptPromise;
  }
  function chartError(kind,message){
    const el=$("#rtw-"+kind+"-chart");if(!el)return;
    el.replaceChildren();
    const p=document.createElement("p");p.className="rtw-note";p.style.padding="16px";p.textContent=message;el.append(p);
  }
  async function renderChart(kind){
    const el=$("#rtw-"+kind+"-chart");if(!el)return;
    const s=state[kind];el.replaceChildren();
    const loading=document.createElement("p");loading.className="rtw-note";loading.style.padding="16px";loading.textContent="Loading TradingView chart…";el.append(loading);
    try{
      await loadTradingView();
      el.replaceChildren();
      const host=document.createElement("div");host.id="rtw-"+kind+"-widget";host.style.height="100%";host.style.width="100%";el.append(host);
      new window.TradingView.widget({
        autosize:true,container_id:host.id,symbol:s.symbol,interval:s.interval,range:s.range,
        timezone:"America/New_York",theme:"dark",style:"1",locale:"en",enable_publishing:false,
        allow_symbol_change:true,save_image:false,hide_side_toolbar:false,withdateranges:true,
        details:true,hotlist:false,calendar:false,studies:s.studies,
        support_host:"https://www.tradingview.com"
      });
    }catch(err){chartError(kind,err.message||"Chart could not load. Use the linked charting resources below.");}
  }
  function exchangeSymbol(kind,symbol){
    if(kind==="crypto")return "BINANCE:"+symbol;
    return (["SPY","QQQ","DIA","IWM","GLD","SLV","UUP","XLB","XLC","XLE","XLF","XLI","XLK","XLP","XLU","XLV","XLY","VIX"].includes(symbol)?"AMEX:":"NASDAQ:")+symbol;
  }
  function renderSymbols(kind){
    const root=$("#rtw-"+kind+"-symbols");if(!root)return;
    const list=kind==="stocks"?stocks:crypto;
    root.replaceChildren();
    list.forEach(symbol=>{
      const b=document.createElement("button");b.type="button";b.textContent=symbol;
      const normalized=kind==="crypto"?"BINANCE:"+symbol:exchangeSymbol(kind,symbol);
      b.setAttribute("aria-pressed",String(state[kind].symbol===normalized));
      b.addEventListener("click",()=>{
        state[kind].symbol=normalized;
        $$("#rtw-"+kind+"-symbols button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
        renderChart(kind);
      });
      root.append(b);
    });
  }
  function renderTimeControls(kind){
    const intervalRoot=$("#rtw-"+kind+"-intervals"),rangeRoot=$("#rtw-"+kind+"-ranges");
    intervals.forEach(item=>{
      const b=document.createElement("button");b.type="button";b.textContent=item.t;b.setAttribute("aria-pressed",String(state[kind].interval===item.v));
      b.addEventListener("click",()=>{state[kind].interval=item.v;$$("button",intervalRoot).forEach(x=>x.setAttribute("aria-pressed",String(x===b)));renderChart(kind);});
      intervalRoot.append(b);
    });
    ranges.forEach(item=>{
      const b=document.createElement("button");b.type="button";b.textContent=item.t;b.setAttribute("aria-pressed",String(state[kind].range===item.v));
      b.addEventListener("click",()=>{state[kind].range=item.v;$$("button",rangeRoot).forEach(x=>x.setAttribute("aria-pressed",String(x===b)));renderChart(kind);});
      rangeRoot.append(b);
    });
  }
  function init(){
    ["stocks","crypto"].forEach(kind=>{
      renderSymbols(kind);renderTimeControls(kind);renderChart(kind);
      const search=$("#rtw-"+kind+"-search"),go=$("#rtw-"+kind+"-go");
      if(search&&go){
        const apply=()=>{
          const raw=search.value.trim().toUpperCase().replace(/\s+/g,"");
          if(!/^[A-Z0-9.:-]{1,20}$/.test(raw)){chartError(kind,"Enter a valid ticker symbol, then try again.");return;}
          if(raw.includes(":"))state[kind].symbol=raw;
          else if(kind==="crypto"){
            const base=raw.replace(/USDT$|USD$/,"");
            state[kind].symbol="BINANCE:"+base+"USDT";
          }else state[kind].symbol=exchangeSymbol(kind,raw);
          renderSymbols(kind);renderChart(kind);
        };
        go.addEventListener("click",apply);search.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();apply();}});
      }
    });
    const posture=$("#rtw-posture-checklist");
    if(posture){
      posture.addEventListener("change",()=>{
        const checks=$$('input[type="checkbox"]',posture);
        $("#rtw-check-progress").textContent=checks.filter(x=>x.checked).length+" of "+checks.length+" pre-trade checks complete";
      });
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
