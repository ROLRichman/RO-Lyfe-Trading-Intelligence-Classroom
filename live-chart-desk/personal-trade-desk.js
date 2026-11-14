(() => {
"use strict";
const $ = (selector) => document.querySelector(selector);
const STORAGE = "rolyfe-chart-watchlists";
const PAPER_STORAGE = "rol-personal-paper-executions";
const COACH_POSITIONS = [
 {symbol:"GRAL",name:"Grail Inc",side:"BUY",date:"11/12/26",entry:121.60,stop:113.03,gain:-4.70,next:"$138.74"},
 {symbol:"CRL",name:"Charles River Laboratories International, Inc.",side:"BUY",date:"11/12/26",entry:340.51,stop:315.35,gain:-0.75,next:"$390.83"},
 {symbol:"WAT",name:"Waters Corp",side:"BUY",date:"11/12/26",entry:463.26,stop:428.74,gain:-0.65,next:"$532.30"},
 {symbol:"APPN",name:"Appian Corp",side:"HOLD",date:"10/9/26",entry:39.63,stop:36.30,gain:37.55,next:"TSL $41.61"},
 {symbol:"CVLT",name:"CommVault Systems, Inc.",side:"BUY",date:"10/9/26",entry:154.61,stop:143.84,gain:-1.64,next:"$176.15"},
 {symbol:"HNGE",name:"Hinge Health, Inc.",side:"HOLD",date:"9/9/26",entry:92.39,stop:84.00,gain:24.89,next:"TSL $112.25",option:"HNGE 18 Dec 2026 $100 Call · entry $8.75 · pay no more than $9.62"},
 {symbol:"NSIT",name:"Insight Enterprises, Inc.",side:"HOLD",date:"7/28/26",entry:125.48,stop:114.70,gain:34.49,next:"TSL $131.75"},
 {symbol:"MU",name:"Micron Technology, Inc.",side:"HOLD",date:"4/22/26",entry:477.70,stop:434.50,gain:62.93,next:"TSL $501.59"},
 {symbol:"NESR",name:"National Energy Services Reunited Corp",side:"HOLD",date:"12/9/25",entry:14.70,stop:13.74,gain:44.15,next:"TSL $15.44"},
 {symbol:"HUT",name:"Hut 8 Corp.",side:"HOLD",date:"4/23/25",entry:12.53,stop:12.53,gain:359.46,next:"TSL $13.16"},
 {symbol:"PLTR",name:"Palantir Technologies Inc",side:"HOLD",date:"8/28/24",entry:29.99,stop:29.99,gain:460.15,next:"TSL $31.49"},
 {symbol:"GILD",name:"Gilead Sciences Inc.",side:"HOLD",date:"8/14/24",entry:74.20,stop:74.20,gain:126.52,next:"TSL $77.91"},
 {symbol:"CRS",name:"Carpenter Technology Corp.",side:"HOLD",date:"8/5/24",entry:121.80,stop:121.80,gain:139.38,next:"TSL $127.89"},
 {symbol:"GLNG",name:"Golar LNG Limited",side:"HOLD",date:"5/9/24",entry:25.97,stop:25.97,gain:65.65,next:"TSL $27.27"},
 {symbol:"KGC",name:"Kinross Gold Corporation",side:"HOLD",date:"4/17/24",entry:6.41,stop:6.41,gain:223.87,next:"TSL $6.73"},
 {symbol:"PRIM",name:"Primoris Services Corporation",side:"HOLD",date:"3/28/24",entry:42.52,stop:42.52,gain:62.98,next:"TSL $44.65"},
 {symbol:"ADMA",name:"ADMA Biologics",side:"HOLD",date:"1/18/24",entry:4.90,stop:4.90,gain:179.18,next:"TSL $5.15"},
 {symbol:"IBKR",name:"Interactive Brokers Group",side:"HOLD",date:"1/2/24",entry:20.94,stop:20.94,gain:290.59,next:"TSL $21.99"}
];
const ALERTS = [
 {symbol:"GRAL",name:"Grail Inc",stop:113.03,entry:121.60},
 {symbol:"CRL",name:"Charles River Laboratories",stop:315.35,entry:340.51},
 {symbol:"WAT",name:"Waters Corp",stop:428.74,entry:463.26}
];
const LIST_LABELS = {stocks:"Stocks / ETFs",crypto:"Crypto",discovery:"Momentum / Discovery",futures:"Futures"};
let selectedList = "stocks";
let activeTicket = null;
let latestAnswer = "";
let speech = null;
const money = (n) => Number.isFinite(Number(n)) ? Number(n).toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:Number(n)<1?4:2}) : "—";
const safeText = (value) => String(value ?? "");
function readLists(){
 try {
  const parsed = JSON.parse(localStorage.getItem(STORAGE)||"{}");
  return {
   stocks:Array.isArray(parsed.stocks)?parsed.stocks:[],
   crypto:Array.isArray(parsed.crypto)?parsed.crypto:[],
   discovery:Array.isArray(parsed.discovery)?parsed.discovery:[],
   futures:Array.isArray(parsed.futures)?parsed.futures:[]
  };
 } catch (_) { return {stocks:[],crypto:[],discovery:[],futures:[]}; }
}
function saveLists(lists){try{localStorage.setItem(STORAGE,JSON.stringify(lists));}catch(_){setImportStatus("This browser could not save the list. Check local storage permissions.");}}
function findCoach(symbol){return COACH_POSITIONS.find(x=>x.symbol===symbol)||null;}
function getChartState(){try{return window.ROLyfeChartDesk?.getState?.()||{};}catch(_){return {};}}
function currentSymbol(){return safeText(getChartState().symbol||"AAPL").toUpperCase();}
function getSignal(){
 const badge=$("#technicalPostureBadge")?.textContent||"";
 if(/BULLISH/i.test(badge))return "bullish";
 if(/BEARISH/i.test(badge))return "bearish";
 return "neutral";
}
function signalLabel(signal){
 if(signal==="bullish")return "BULLISH · BUY SETUP REVIEW";
 if(signal==="bearish")return "BEARISH · SELL / EXIT REVIEW";
 return "NEUTRAL · WAIT / WATCH";
}
function signalClass(signal){return signal==="bullish"?"signal-bullish":signal==="bearish"?"signal-bearish":"signal-neutral";}
function updateClock(){
 const now=new Date();
 const time=$("#rolPersonalClock"),date=$("#rolPersonalDate"),session=$("#rolPersonalSession");
 if(time)time.textContent=new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}).format(now);
 if(date)date.textContent=new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(now);
 if(session){
  const parts=new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",hour:"2-digit",minute:"2-digit",hour12:false,weekday:"short"}).formatToParts(now);
  const get=(k)=>parts.find(x=>x.type===k)?.value||"";
  const day=get("weekday"),hour=Number(get("hour")),minute=Number(get("minute")),mins=hour*60+minute;
  const weekday=["Mon","Tue","Wed","Thu","Fri"].includes(day);
  let label="Market closed";
  if(weekday&&mins>=570&&mins<960)label="Regular session · 9:30 AM–4:00 PM ET";
  else if(weekday&&mins>=240&&mins<570)label="Pre-market hours";
  else if(weekday&&mins>=960&&mins<1200)label="After-hours window";
  session.textContent=label;
 }
}
function renderCoachPositions(){
 const summary=$("#rolCoachPositionSummary"),cards=$("#rolCoachPositionCards");
 if(summary)summary.innerHTML=[
  ["Positions","18"],["Newest entries","GRAL · CRL · WAT"],["Source","Coach reference"]
 ].map(([label,value])=>'<div><small>'+label+'</small><strong>'+value+'</strong></div>').join("");
 if(!cards)return;
 cards.innerHTML="";
 COACH_POSITIONS.forEach(item=>{
  const button=document.createElement("button");button.type="button";button.className="personal-position-row";
  const title=document.createElement("strong");title.textContent=item.symbol+" · "+(item.side==="BUY"?"BUY":"HOLD");
  const detail=document.createElement("small");detail.textContent=item.date+" · Entry "+money(item.entry)+" · Stop "+money(item.stop)+" · "+(item.gain>0?"+":"")+item.gain.toFixed(2)+"%";
  button.append(title,detail);button.addEventListener("click",()=>openTicket(item.symbol,item));cards.append(button);
 });
}
function renderAlerts(){
 const host=$("#rolPersonalAlerts");if(!host)return;host.innerHTML="";
 ALERTS.forEach(item=>{
  const button=document.createElement("button");button.type="button";button.className="personal-alert-row";
  const left=document.createElement("span"),right=document.createElement("b"),title=document.createElement("strong"),small=document.createElement("small");
  title.textContent="BUY "+item.symbol+" · "+item.name;small.textContent="Coach reference entry "+money(item.entry)+" · GTC stop reference "+money(item.stop);
  left.append(title,small);right.textContent="Review →";button.append(left,right);button.addEventListener("click",()=>openTicket(item.symbol,item));host.append(button);
 });
}
function boolValue(value){
 if(value===true||value===1)return true;
 const text=safeText(value).toLowerCase();
 return text==="true"||text==="1"||text==="yes";
}
function cardSignal(symbol){
 if(symbol===currentSymbol())return getSignal();
 const rows=Array.isArray(window.ROLyfeLatestScanRows)?window.ROLyfeLatestScanRows:[];
 const row=rows.find(item=>safeText(item.ticker||item.symbol).toUpperCase()===symbol);
 if(!row)return "neutral";
 let bullish=0,bearish=0;
 const vote=(up,down)=>{if(up)bullish++;else if(down)bearish++;};
 if(row.above_vwap!==undefined||row.above_sma_50!==undefined||row.above_sma_200!==undefined){
  vote(boolValue(row.above_vwap),row.above_vwap!==undefined&&!boolValue(row.above_vwap));
  vote(boolValue(row.above_sma_50),row.above_sma_50!==undefined&&!boolValue(row.above_sma_50));
  vote(boolValue(row.above_sma_200),row.above_sma_200!==undefined&&!boolValue(row.above_sma_200));
 }
 const rsi=Number(row.rsi_14),macd=Number(row.macd_histogram),k=Number(row.stochastic_k),d=Number(row.stochastic_d);
 if(Number.isFinite(rsi))vote(rsi>=55,rsi<=45);
 if(Number.isFinite(macd))vote(macd>0,macd<0);
 if(Number.isFinite(k)&&Number.isFinite(d))vote(k>d,k<d);
 if(bullish>=3&&bullish>bearish)return "bullish";
 if(bearish>=3&&bearish>bullish)return "bearish";
 return "neutral";
}
function passesSignalFilter(item,reference){
 const filter=$("#rolPersonalSignalFilter")?.value||"all";
 if(filter==="all")return true;
 const signal=reference?(item.side==="BUY"?"bullish":"neutral"):cardSignal(item.symbol);
 return signal===filter;
}
function renderWatchlist(){
 const select=$("#rolPersonalWatchlistSelect"),host=$("#rolPersonalWatchlistCards"),count=$("#rolWatchCount");
 if(!select||!host)return;
 selectedList=select.value;
 if(selectedList==="coach"){
  host.innerHTML="";
  const visible=COACH_POSITIONS.filter(item=>passesSignalFilter(item,true));
  visible.forEach(item=>host.append(createWatchCard(item,{reference:true})));
  if(count)count.textContent=visible.length+" / 18";
  if(!visible.length){const p=document.createElement("p");p.className="personal-empty";p.textContent="No coach reference positions match this signal filter.";host.append(p);}
  return;
 }
 const lists=readLists(),items=lists[selectedList]||[];
 const visible=items.filter(item=>passesSignalFilter(item,false));
 host.innerHTML="";
 if(count)count.textContent=visible.length+(visible.length!==items.length?" / "+items.length:"");
 if(!visible.length){
  const p=document.createElement("p");p.className="personal-empty";p.textContent=selectedList==="discovery"?"No momentum symbols imported yet. Import your coach’s 98-symbol .txt or .csv list below.":"This list is empty. Add a ticker below.";
  host.append(p);return;
 }
 visible.forEach(item=>host.append(createWatchCard(item,{reference:false})));
}
function createWatchCard(item,options){
 const ref=Boolean(options?.reference),button=document.createElement("button");button.type="button";button.className="personal-watch-card";
 const left=document.createElement("span"),right=document.createElement("span"),symbol=document.createElement("strong"),name=document.createElement("small"),price=document.createElement("span"),sig=document.createElement("span");
 const sym=safeText(item.symbol).toUpperCase(),coach=ref?item:findCoach(sym),q=getChartState().symbol===sym?getChartState().quote:null;
 symbol.textContent=sym;name.textContent=ref?(item.name+" · "+item.date):(item.name||LIST_LABELS[selectedList]||"Watchlist item");
 const showPrice=q&&Number.isFinite(Number(q.price))?money(q.price):(coach?("Ref "+money(coach.entry)):"Quote pending");
 price.className="personal-watch-price";price.textContent=showPrice;
 const signal=ref?(item.side==="BUY"?"bullish":"neutral"):cardSignal(sym);
 sig.className="personal-signal "+signalClass(signal);sig.textContent=ref?(item.side+" · COACH REF"):signalLabel(signal).split(" · ")[0];
 left.append(symbol,name);right.className="personal-watch-right";right.append(price,sig);button.append(left,right);
 button.addEventListener("click",()=>openTicket(sym,coach));
 return button;
}
function addSymbol(raw){
 let symbol=safeText(raw).trim().toUpperCase();
 if(symbol.includes(":"))symbol=symbol.split(":").pop();
 if(!/^[A-Z0-9.^_-]{1,20}$/.test(symbol))throw new Error("Enter a valid ticker symbol.");
 const lists=readLists();
 if(selectedList==="coach"){selectedList="stocks";if($("#rolPersonalWatchlistSelect"))$("#rolPersonalWatchlistSelect").value="stocks";}
 const list=lists[selectedList]||lists.stocks;
 const normalized=selectedList==="crypto"&&!symbol.endsWith("-USD")?symbol+"-USD":symbol;
 if(list.some(item=>item.symbol===normalized)){window.ROLyfeChartDesk?.setSymbol?.(normalized);return normalized;}
 const item={symbol:normalized,name:normalized};
 if(selectedList==="crypto")item.api=normalized.replace(/-USD$/,"");
 if(selectedList==="futures")item.assetClass="futures";
 list.push(item);saveLists(lists);renderWatchlist();window.ROLyfeChartDesk?.setSymbol?.(normalized);return normalized;
}
function setImportStatus(message){const el=$("#rolMomentumImportStatus");if(el)el.textContent=message;}
function parseSymbols(text){
 const tokens=safeText(text).toUpperCase().split(/[\s,;|]+/).map(x=>x.trim()).filter(Boolean);
 return [...new Set(tokens.map(x=>x.replace(/^\$|^NYSE:|^NASDAQ:|^AMEX:/,"")).filter(x=>/^[A-Z0-9.^_-]{1,20}$/.test(x)))];
}
function importMomentum(text){
 const symbols=parseSymbols(text);if(!symbols.length){setImportStatus("No valid ticker symbols found. Paste the symbols from your coach’s list or choose the CSV/TXT file.");return;}
 const lists=readLists(),existing=new Set(lists.discovery.map(x=>x.symbol));
 let added=0;symbols.forEach(symbol=>{if(!existing.has(symbol)){lists.discovery.push({symbol,name:symbol});existing.add(symbol);added++;}});
 saveLists(lists);selectedList="discovery";if($("#rolPersonalWatchlistSelect"))$("#rolPersonalWatchlistSelect").value="discovery";renderWatchlist();
 setImportStatus(added+" ticker(s) imported into Momentum / Discovery. "+(symbols.length-added)+" duplicate(s) skipped. Confirm symbols against the original list.");
}
function openScanner(id){
 const node=$("#"+id);if(!node)return;
 node.open=true;node.scrollIntoView({behavior:"smooth",block:"start"});
 if(id==="symbol-scanner"){
  const type=$("#scannerAssetClass");if(type&&["stocks","crypto","discovery","futures"].includes(selectedList))type.value=selectedList;
 }
}
function syncPosture(){
 const label=$("#rolPersonalPosture"),note=$("#rolPersonalPostureNote"),badge=$("#technicalPostureBadge"),copy=$("#technicalPostureCopy"),range=$("#rolPersonalChartRange");
 const signal=getSignal();if(label){label.textContent=signalLabel(signal);label.className=signalClass(signal);}
 if(note)note.textContent=copy?.textContent||"Waiting for chart candles and indicator confluence.";
 const state=getChartState();if(range)range.textContent="Current chart · "+(state.rangeLabel||state.interval||"1D");
 document.querySelectorAll("[data-rol-interval]").forEach(b=>b.classList.toggle("active",!state.rangeLabel&&b.dataset.rolInterval===state.interval));
 document.querySelectorAll("[data-rol-range-days]").forEach(b=>b.classList.toggle("active",state.rangeLabel===b.dataset.rolRangeLabel));
 if(badge&&label)label.title=badge.textContent;
}
function updateTicketFromQuote(){
 if(!activeTicket)return;
 const state=getChartState(),quote=state.quote,quoteLabel=$("#rolExecutionQuote"),entry=$("#rolExecutionEntry");
 if(quote&&Number.isFinite(Number(quote.price))){
  if(quoteLabel)quoteLabel.textContent=money(Number(quote.price))+" · "+(quote.provider||"Provider")+" · "+(quote.stamp||"timestamp not supplied");
  if(entry&&!entry.dataset.userEdited)entry.value=Number(quote.price).toFixed(4);
 }else if(quoteLabel)quoteLabel.textContent="No verified quote available · enter a manual assumption";
 updateExecutionSummary();
}
function openTicket(symbol,reference){
 activeTicket={symbol,reference:reference||findCoach(symbol),openedAt:new Date().toISOString()};
 window.ROLyfeChartDesk?.setSymbol?.(symbol);
 const modal=$("#rolExecutionModal"),backdrop=$("#rolExecutionBackdrop");
 if(!modal||!backdrop)return;
 $("#rolExecutionTitle").textContent=symbol+" · Paper Execution Review";
 $("#rolExecutionMeta").textContent="Chart selection and proposed scenario only. No brokerage order will be sent.";
 $("#rolExecutionPosture").textContent=signalLabel(symbol===currentSymbol()?getSignal():"neutral");
 $("#rolExecutionPosture").className=signalClass(symbol===currentSymbol()?getSignal():"neutral");
 const entry=$("#rolExecutionEntry"),stop=$("#rolExecutionStop"),target=$("#rolExecutionTarget"),qty=$("#rolExecutionQty");
 [entry,stop,target].forEach(el=>{if(el)delete el.dataset.userEdited;});
 const q=getChartState().quote,ref=activeTicket.reference;
 entry.value=q&&Number.isFinite(Number(q.price))?Number(q.price).toFixed(4):(ref?Number(ref.entry).toFixed(4):"");
 stop.value=ref?Number(ref.stop).toFixed(4):"";
 target.value=ref?Number(String(ref.next).match(/\$([0-9.]+)/)?.[1]||"").toFixed(4):"";
 qty.value="1";$("#rolExecutionBudget").value="100";
 $("#rolExecutionType").value="MARKET";$("#rolExecutionSide").value=(ref&&ref.side==="HOLD")?"BUY":(ref?.side||"BUY");
 $("#rolExecutionSummary").textContent="Loading quote status and calculating the proposed paper plan…";
 modal.hidden=false;backdrop.hidden=false;document.body.classList.add("personal-execution-open");
 updateTicketFromQuote();setTimeout(updateTicketFromQuote,500);setTimeout(updateTicketFromQuote,1400);
 modal.scrollTop=0;$("#rolExecutionEntry").focus({preventScroll:true});
}
function closeTicket(){
 const modal=$("#rolExecutionModal"),backdrop=$("#rolExecutionBackdrop");
 if(modal)modal.hidden=true;if(backdrop)backdrop.hidden=true;
 document.body.classList.remove("personal-execution-open");activeTicket=null;
}
function readTicket(){
 return {
  symbol:activeTicket?.symbol||currentSymbol(),
  side:$("#rolExecutionSide")?.value||"BUY",
  orderType:$("#rolExecutionType")?.value||"MARKET",
  entry:Number($("#rolExecutionEntry")?.value),
  stop:Number($("#rolExecutionStop")?.value),
  target:Number($("#rolExecutionTarget")?.value),
  quantity:Number($("#rolExecutionQty")?.value),
  budget:Number($("#rolExecutionBudget")?.value),
  quote:getChartState().quote||null,
  posture:activeTicket?.symbol===currentSymbol()?getSignal():"neutral"
 };
}
function validateTicket(plan){
 if(!Number.isFinite(plan.entry)||plan.entry<=0)return "Enter a positive entry price. For Market simulation, this is only the displayed quote assumption.";
 if(!Number.isFinite(plan.stop)||plan.stop<=0)return "Enter a positive protective stop price.";
 if(!Number.isFinite(plan.target)||plan.target<=0)return "Enter a positive target price.";
 if(!Number.isInteger(plan.quantity)||plan.quantity<1)return "Quantity must be a whole number of shares or units.";
 if(!Number.isFinite(plan.budget)||plan.budget<0)return "Risk budget must be zero or greater.";
 if(plan.side==="BUY"&&(plan.stop>=plan.entry||plan.target<=plan.entry))return "For a BUY scenario, stop must be below entry and target above entry.";
 if(plan.side==="SELL"&&(plan.stop<=plan.entry||plan.target>=plan.entry))return "For a SELL scenario, stop must be above entry and target below entry.";
 return "";
}
function updateExecutionSummary(){
 const host=$("#rolExecutionSummary");if(!host||!activeTicket)return;
 const p=readTicket(),error=validateTicket(p);
 if(error){host.textContent=error;return;}
 const riskPer=Math.abs(p.entry-p.stop),totalRisk=riskPer*p.quantity,profitPer=Math.abs(p.target-p.entry),totalReward=profitPer*p.quantity,rr=totalRisk?totalReward/totalRisk:0;
 host.textContent="PAPER PLAN · "+p.side+" "+p.quantity+" "+p.symbol+"\nEntry assumption: "+money(p.entry)+" · Stop: "+money(p.stop)+" · Target: "+money(p.target)+"\nModeled stop risk: "+money(totalRisk)+" ("+money(riskPer)+" per unit) · Modeled target reward: "+money(totalReward)+"\nReward / risk: "+rr.toFixed(2)+":1 · Risk budget: "+money(p.budget)+" · "+(totalRisk<=p.budget?"WITHIN BUDGET":"OVER BUDGET")+"\nStatus: NOT SUBMITTED · No brokerage connected.";
}
function simulatePaperExecution(){
 const plan=readTicket(),error=validateTicket(plan);
 if(error){$("#rolExecutionSummary").textContent=error;return;}
 const risk=Math.abs(plan.entry-plan.stop)*plan.quantity,reward=Math.abs(plan.target-plan.entry)*plan.quantity;
 const row={id:"paper-"+Date.now(),createdAt:new Date().toISOString(),...plan,modeledRisk:risk,modeledReward:reward,status:"PAPER_SIMULATION_ONLY",sentToBroker:false,source:"RO’Lyfe local browser simulation"};
 let history=[];try{history=JSON.parse(localStorage.getItem(PAPER_STORAGE)||"[]");if(!Array.isArray(history))history=[];}catch(_){history=[];}
 history.unshift(row);
 try{localStorage.setItem(PAPER_STORAGE,JSON.stringify(history.slice(0,100)));}
 catch(_){$("#rolExecutionSummary").textContent="Could not save simulation in this browser. No order was sent.";return;}
 $("#rolExecutionSummary").textContent="PAPER SIMULATION LOGGED · "+row.id+"\n"+plan.side+" "+plan.quantity+" "+plan.symbol+" · Entry "+money(plan.entry)+" · Stop "+money(plan.stop)+" · Target "+money(plan.target)+"\nModeled risk "+money(risk)+" · Modeled reward "+money(reward)+" · "+(risk<=plan.budget?"Within budget":"Over budget")+"\nSaved locally in this browser only. NO ORDER WAS SENT. No brokerage is connected.";
 $("#rolAtlasQuestion").value="Explain this paper-trading scenario in plain language: "+$("#rolExecutionSummary").textContent;
}
function explainWithAtlas(){
 const p=readTicket();$("#rolAtlasQuestion").value="Atlas, explain this paper execution scenario, its entry assumption, stop, target, modeled risk, budget check, and what could invalidate the chart setup. Be clear that nothing is being sent to a brokerage.\n"+$("#rolExecutionSummary").textContent;
 setAtlasOpen(true);askAtlas();
}
function setAtlasOpen(open){
 const panel=$("#rolAtlasPanel"),button=$("#rolAtlasLaunch");if(!panel||!button)return;
 panel.hidden=!open;button.setAttribute("aria-expanded",String(open));button.querySelector("i").textContent=open?"⌄":"⌃";
}
function askAtlas(){
 const input=$("#rolAtlasQuestion"),status=$("#rolAtlasStatus"),answer=$("#rolAtlasAnswer"),target=$("#rolTradeAiQuestion"),form=$("#rolTradeAiForm");
 const question=input?.value.trim();if(!question){if(status)status.textContent="Enter a question or choose a shortcut.";return;}
 if(!target||!form){if(status)status.textContent="Trading AI form is not available on this page.";return;}
 const state=getChartState(),context="Current symbol: "+(state.symbol||"unknown")+". Chart interval: "+(state.rangeLabel||state.interval||"unknown")+". Quote: "+(state.quote?money(state.quote.price)+" from "+state.quote.provider+" at "+state.quote.stamp:"not available")+". Chart posture: "+($("#technicalPostureBadge")?.textContent||"not available")+". Paper ticket: "+(activeTicket?($("#rolExecutionSummary")?.textContent||"open ticket"): "none open")+".";
 target.value=question+"\n\nAdditional current context: "+context;
 if($("#rolSidekickMode"))$("#rolSidekickMode").value="coach";
 if(status)status.textContent="Atlas is reviewing the current chart and the information supplied…";
 if(answer)answer.textContent="Atlas is preparing an explanation…";
 latestAnswer="";
 const observer=new MutationObserver(()=>{
  const text=$("#rolTradeAiAnswer")?.textContent?.trim()||"";
  if(text&&text!=="AI analysis will appear here after the first question."&&text!==latestAnswer){
   latestAnswer=text;if(answer)answer.textContent=text;
   if(status)status.textContent=$("#rolTradeAiStatus")?.textContent||"Atlas response ready.";
   observer.disconnect();
  }
 });
 if(answer)observer.observe($("#rolTradeAiAnswer"),{childList:true,characterData:true,subtree:true});
 form.requestSubmit();
 setTimeout(()=>{if(status&&status.textContent.includes("reviewing"))status.textContent=$("#rolTradeAiStatus")?.textContent||"Atlas request submitted to the trading analysis service.";},1800);
}
function speakAtlas(){
 const text=$("#rolAtlasAnswer")?.textContent?.trim();
 if(!text||!window.speechSynthesis||!window.SpeechSynthesisUtterance){$("#rolAtlasStatus").textContent="Read-aloud is not available in this browser/device.";return;}
 window.speechSynthesis.cancel();speech=new SpeechSynthesisUtterance(text);speech.rate=1;speech.pitch=1;speech.lang="en-US";
 speech.onstart=()=>{$("#rolAtlasStatus").textContent="Atlas is reading the explanation aloud.";};
 speech.onend=()=>{$("#rolAtlasStatus").textContent="Read-aloud complete.";};
 speech.onerror=()=>{$("#rolAtlasStatus").textContent="Voice playback is unavailable for this response.";};
 window.speechSynthesis.speak(speech);
}
function init(){
 updateClock();setInterval(updateClock,1000);
 const date=$("#rolPersonalCalendar");if(date){date.value=new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"});date.addEventListener("change",()=>{$("#rolCalendarNote").textContent=date.value?"Selected review date · "+date.value:"Choose a date to focus your journal and review.";});}
 renderAlerts();renderCoachPositions();renderWatchlist();syncPosture();
 $("#rolPersonalWatchlistSelect")?.addEventListener("change",renderWatchlist);
 $("#rolPersonalSignalFilter")?.addEventListener("change",renderWatchlist);
 window.addEventListener("rol-scan-complete",renderWatchlist);
 $("#rolRefreshWatchlist")?.addEventListener("click",()=>{renderWatchlist();syncPosture();});
 $("#rolPersonalAddForm")?.addEventListener("submit",(e)=>{e.preventDefault();try{addSymbol($("#rolPersonalAddSymbol").value);$("#rolPersonalAddSymbol").value="";}catch(error){alert(error.message);}});
 $("#rolImportMomentum")?.addEventListener("click",()=>importMomentum($("#rolMomentumImportText").value));
 $("#rolMomentumImportFile")?.addEventListener("change",(e)=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>importMomentum(String(reader.result||""));reader.onerror=()=>setImportStatus("The selected file could not be read.");reader.readAsText(file);});
 document.querySelectorAll("[data-personal-scanner]").forEach(b=>b.addEventListener("click",()=>openScanner(b.dataset.personalScanner)));
 document.querySelectorAll("[data-rol-interval]").forEach(b=>b.addEventListener("click",()=>{
  const v=b.dataset.rolInterval;if(window.ROLyfeChartDesk?.setInterval?.(v)){document.querySelectorAll("[data-rol-interval],[data-rol-range-days]").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#rolPersonalChartRange").textContent="Current chart · "+v.toUpperCase();}
  else $("#rolPersonalChartRange").textContent="This chart interval is unavailable.";
 }));
 document.querySelectorAll("[data-rol-range-days]").forEach(b=>b.addEventListener("click",()=>{
  const ok=window.ROLyfeChartDesk?.setRange?.(Number(b.dataset.rolRangeDays),b.dataset.rolRangeLabel);
  if(ok){document.querySelectorAll("[data-rol-interval],[data-rol-range-days]").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#rolPersonalChartRange").textContent="Current chart · "+b.dataset.rolRangeLabel;}
  else $("#rolPersonalChartRange").textContent="Daily lookback could not be loaded.";
 }));
 $("#rolJumpToChart")?.addEventListener("click",()=>$(".chart-panel")?.scrollIntoView({behavior:"smooth",block:"start"}));
 $("#rolHngeOption")?.addEventListener("click",()=>{window.ROLyfeChartDesk?.setSymbol?.("HNGE");$("#sendToOptionLadder")?.click();});
 $("#rolExecutionClose")?.addEventListener("click",closeTicket);
 $("#rolExecutionBackdrop")?.addEventListener("click",closeTicket);
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeTicket();});
 ["rolExecutionEntry","rolExecutionStop","rolExecutionTarget"].forEach(id=>$("#"+id)?.addEventListener("input",e=>{e.target.dataset.userEdited="1";updateExecutionSummary();}));
 ["rolExecutionSide","rolExecutionType","rolExecutionQty","rolExecutionBudget"].forEach(id=>$("#"+id)?.addEventListener("input",updateExecutionSummary));
 $("#rolRunPaperExecution")?.addEventListener("click",simulatePaperExecution);
 $("#rolExplainExecution")?.addEventListener("click",explainWithAtlas);
 $("#rolAtlasLaunch")?.addEventListener("click",()=>setAtlasOpen($("#rolAtlasPanel").hidden));
 $("#rolAtlasClose")?.addEventListener("click",()=>setAtlasOpen(false));
 $("#rolAtlasAsk")?.addEventListener("click",askAtlas);
 $("#rolAtlasSpeak")?.addEventListener("click",speakAtlas);
 $("#rolAtlasStop")?.addEventListener("click",()=>{if(window.speechSynthesis)window.speechSynthesis.cancel();$("#rolAtlasStatus").textContent="Read-aloud stopped.";});
 document.querySelectorAll("[data-atlas-prompt]").forEach(b=>b.addEventListener("click",()=>{$("#rolAtlasQuestion").value=b.dataset.atlasPrompt;}));
 $("#rolAtlasQuestion")?.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")askAtlas();});
 const posture=$("#technicalPostureBadge"),chartStatus=$("#chartStatus");
 if(posture)new MutationObserver(syncPosture).observe(posture,{childList:true,characterData:true,subtree:true});
 if(chartStatus)new MutationObserver(()=>{syncPosture();updateTicketFromQuote();renderWatchlist();}).observe(chartStatus,{childList:true,characterData:true,subtree:true});
 window.addEventListener("storage",e=>{if(e.key===STORAGE)renderWatchlist();});
 setInterval(()=>{syncPosture();updateTicketFromQuote();},1500);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();