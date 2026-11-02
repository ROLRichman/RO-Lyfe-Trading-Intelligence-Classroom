(() => {
"use strict";
const $=s=>document.querySelector(s);
if(new URLSearchParams(location.search).get("embed")==="classroom")document.body.classList.add("classroom-embed");
const API="https://ykmdyfbklvuoseqdjnxy.supabase.co/functions/v1/market-data";
const ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWR5ZmJrbHZ1b3NlcWRqbnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODk5OTQsImV4cCI6MjEwODM2NTk5NH0._YEZj2GSnPcLGXmwgj98V_JzXdJIhTmOFoAH9BSia2I";
const defaults={"stocks":[{"symbol":"AAPL","name":"Apple"},{"symbol":"NVDA","name":"NVIDIA"},{"symbol":"TSLA","name":"Tesla"},{"symbol":"AMD","name":"AMD"},{"symbol":"SPY","name":"S&P 500 ETF"},{"symbol":"MSFT","name":"Microsoft"},{"symbol":"AMZN","name":"Amazon"},{"symbol":"GOOGL","name":"Alphabet A"},{"symbol":"GOOG","name":"Alphabet C"},{"symbol":"META","name":"Meta Platforms"},{"symbol":"NFLX","name":"Netflix"},{"symbol":"AVGO","name":"Broadcom"},{"symbol":"ORCL","name":"Oracle"},{"symbol":"CRM","name":"Salesforce"},{"symbol":"ADBE","name":"Adobe"},{"symbol":"QCOM","name":"Qualcomm"},{"symbol":"INTC","name":"Intel"},{"symbol":"MU","name":"Micron"},{"symbol":"ARM","name":"Arm Holdings"},{"symbol":"SMCI","name":"Super Micro Computer"},{"symbol":"PLTR","name":"Palantir"},{"symbol":"COIN","name":"Coinbase"},{"symbol":"HOOD","name":"Robinhood"},{"symbol":"MSTR","name":"Strategy"},{"symbol":"JPM","name":"JPMorgan Chase"},{"symbol":"BAC","name":"Bank of America"},{"symbol":"WFC","name":"Wells Fargo"},{"symbol":"GS","name":"Goldman Sachs"},{"symbol":"MS","name":"Morgan Stanley"},{"symbol":"V","name":"Visa"},{"symbol":"MA","name":"Mastercard"},{"symbol":"AXP","name":"American Express"},{"symbol":"COST","name":"Costco"},{"symbol":"WMT","name":"Walmart"},{"symbol":"TGT","name":"Target"},{"symbol":"HD","name":"Home Depot"},{"symbol":"LOW","name":"Lowe's"},{"symbol":"NKE","name":"Nike"},{"symbol":"DIS","name":"Disney"},{"symbol":"UBER","name":"Uber"},{"symbol":"ABNB","name":"Airbnb"},{"symbol":"SHOP","name":"Shopify"},{"symbol":"SNOW","name":"Snowflake"},{"symbol":"PANW","name":"Palo Alto Networks"},{"symbol":"CRWD","name":"CrowdStrike"},{"symbol":"NET","name":"Cloudflare"},{"symbol":"DDOG","name":"Datadog"},{"symbol":"IBM","name":"IBM"},{"symbol":"CSCO","name":"Cisco"},{"symbol":"NOW","name":"ServiceNow"},{"symbol":"PYPL","name":"PayPal"},{"symbol":"SQ","name":"Block"},{"symbol":"SOFI","name":"SoFi"},{"symbol":"XOM","name":"Exxon Mobil"},{"symbol":"CVX","name":"Chevron"},{"symbol":"LLY","name":"Eli Lilly"},{"symbol":"JNJ","name":"Johnson & Johnson"},{"symbol":"PFE","name":"Pfizer"},{"symbol":"MRNA","name":"Moderna"},{"symbol":"UNH","name":"UnitedHealth"},{"symbol":"ABBV","name":"AbbVie"},{"symbol":"TMO","name":"Thermo Fisher"},{"symbol":"CAT","name":"Caterpillar"},{"symbol":"DE","name":"Deere"},{"symbol":"BA","name":"Boeing"},{"symbol":"GE","name":"GE Aerospace"},{"symbol":"F","name":"Ford"},{"symbol":"GM","name":"General Motors"},{"symbol":"RIVN","name":"Rivian"},{"symbol":"LCID","name":"Lucid"},{"symbol":"IWM","name":"Russell 2000 ETF"},{"symbol":"QQQ","name":"Nasdaq-100 ETF"},{"symbol":"DIA","name":"Dow Jones ETF"},{"symbol":"VTI","name":"Total US Market ETF"},{"symbol":"GLD","name":"Gold ETF"},{"symbol":"TLT","name":"20+ Year Treasury ETF"}],"crypto":[{"symbol":"BTC-USD","name":"Bitcoin","api":"BTC"},{"symbol":"ETH-USD","name":"Ethereum","api":"ETH"},{"symbol":"SOL-USD","name":"Solana","api":"SOL"},{"symbol":"XRP-USD","name":"XRP","api":"XRP"},{"symbol":"LINK-USD","name":"Chainlink","api":"LINK"},{"symbol":"HYPE-USD","name":"Hyperliquid","api":"HYPE"},{"symbol":"BNB-USD","name":"BNB","api":"BNB"},{"symbol":"ADA-USD","name":"Cardano","api":"ADA"},{"symbol":"DOGE-USD","name":"Dogecoin","api":"DOGE"},{"symbol":"AVAX-USD","name":"Avalanche","api":"AVAX"},{"symbol":"DOT-USD","name":"Polkadot","api":"DOT"},{"symbol":"LTC-USD","name":"Litecoin","api":"LTC"},{"symbol":"BCH-USD","name":"Bitcoin Cash","api":"BCH"},{"symbol":"SUI-USD","name":"Sui","api":"SUI"},{"symbol":"TON-USD","name":"Toncoin","api":"TON"},{"symbol":"TRX-USD","name":"TRON","api":"TRX"},{"symbol":"XLM-USD","name":"Stellar","api":"XLM"},{"symbol":"HBAR-USD","name":"Hedera","api":"HBAR"},{"symbol":"SHIB-USD","name":"Shiba Inu","api":"SHIB"},{"symbol":"PEPE-USD","name":"Pepe","api":"PEPE"},{"symbol":"UNI-USD","name":"Uniswap","api":"UNI"},{"symbol":"AAVE-USD","name":"Aave","api":"AAVE"},{"symbol":"NEAR-USD","name":"NEAR Protocol","api":"NEAR"},{"symbol":"APT-USD","name":"Aptos","api":"APT"},{"symbol":"ARB-USD","name":"Arbitrum","api":"ARB"},{"symbol":"OP-USD","name":"Optimism","api":"OP"},{"symbol":"ICP-USD","name":"Internet Computer","api":"ICP"},{"symbol":"FIL-USD","name":"Filecoin","api":"FIL"},{"symbol":"ATOM-USD","name":"Cosmos","api":"ATOM"},{"symbol":"ETC-USD","name":"Ethereum Classic","api":"ETC"},{"symbol":"XMR-USD","name":"Monero","api":"XMR"},{"symbol":"INJ-USD","name":"Injective","api":"INJ"},{"symbol":"RENDER-USD","name":"Render","api":"RENDER"},{"symbol":"FET-USD","name":"Artificial Superintelligence Alliance","api":"FET"},{"symbol":"TAO-USD","name":"Bittensor","api":"TAO"},{"symbol":"SEI-USD","name":"Sei","api":"SEI"},{"symbol":"TIA-USD","name":"Celestia","api":"TIA"},{"symbol":"IMX-USD","name":"Immutable","api":"IMX"},{"symbol":"GRT-USD","name":"The Graph","api":"GRT"},{"symbol":"MKR-USD","name":"Maker","api":"MKR"},{"symbol":"PENDLE-USD","name":"Pendle","api":"PENDLE"},{"symbol":"ONDO-USD","name":"Ondo","api":"ONDO"},{"symbol":"JUP-USD","name":"Jupiter","api":"JUP"},{"symbol":"WIF-USD","name":"dogwifhat","api":"WIF"},{"symbol":"BONK-USD","name":"Bonk","api":"BONK"},{"symbol":"FLOKI-USD","name":"Floki","api":"FLOKI"},{"symbol":"ALGO-USD","name":"Algorand","api":"ALGO"},{"symbol":"VET-USD","name":"VeChain","api":"VET"},{"symbol":"RUNE-USD","name":"THORChain","api":"RUNE"},{"symbol":"CRV-USD","name":"Curve DAO","api":"CRV"}],"discovery":[{"symbol":"ALAB","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"ANET","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"AMKR","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"AMBA","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"ACLS","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"COHR","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"CLS","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"CIEN","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"CRDO","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"FN","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"FORM","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"INTC","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"LITE","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"MRVL","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"MOD","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"MPWR","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"NTAP","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"PSTG","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"SMCI","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"STX","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"TER","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"VRT","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"WDC","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"DELL","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"HPE","name":"AI chips & compute","category":"AI chips & compute","assetClass":"stocks"},{"symbol":"SYM","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"CGNX","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"PATH","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"ROK","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"ZBRA","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"ISRG","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"SERV","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"RR","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"HON","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"ABB","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"MBLY","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"LAZR","name":"Robotics & automation","category":"Robotics & automation","assetClass":"stocks"},{"symbol":"RKLB","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"ASTS","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"LUNR","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"RDW","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"PL","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"BKSY","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"SPIR","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"GSAT","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"VSAT","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"IRDM","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"MDA","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"JOBY","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"ACHR","name":"Space & aerospace","category":"Space & aerospace","assetClass":"stocks"},{"symbol":"IONQ","name":"Quantum computing","category":"Quantum computing","assetClass":"stocks"},{"symbol":"QBTS","name":"Quantum computing","category":"Quantum computing","assetClass":"stocks"},{"symbol":"RGTI","name":"Quantum computing","category":"Quantum computing","assetClass":"stocks"},{"symbol":"QUBT","name":"Quantum computing","category":"Quantum computing","assetClass":"stocks"},{"symbol":"INFQ","name":"Quantum computing","category":"Quantum computing","assetClass":"stocks"},{"symbol":"ARQQ","name":"Quantum computing","category":"Quantum computing","assetClass":"stocks"},{"symbol":"LAES","name":"Quantum computing","category":"Quantum computing","assetClass":"stocks"},{"symbol":"OKLO","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"SMR","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"NNE","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"LEU","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"CCJ","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"UEC","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"UUUU","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"DNN","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"NXE","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"BWXT","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"CEG","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"VST","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"TLN","name":"Nuclear & uranium","category":"Nuclear & uranium","assetClass":"stocks"},{"symbol":"EOSE","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"FLNC","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"BE","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"STEM","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"ENPH","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"SEDG","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"NXT","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"AES","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"ALB","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"LAC","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"QS","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"ENVX","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"FREY","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"MVST","name":"Energy storage & power","category":"Energy storage & power","assetClass":"stocks"},{"symbol":"S","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"TENB","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"VRNS","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"QLYS","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"GEN","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"RPD","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"OKTA","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"ZS","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"NET","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"CYBR","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"OSIS","name":"Cybersecurity","category":"Cybersecurity","assetClass":"stocks"},{"symbol":"AVAV","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"KTOS","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"RCAT","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"UMAC","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"DPRO","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"PLTR","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"MRCY","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"AXON","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"CW","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"TXT","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"HII","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"LHX","name":"Defense & autonomy","category":"Defense & autonomy","assetClass":"stocks"},{"symbol":"RXRX","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"TEM","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"SDGR","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"CRSP","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"NTLA","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"BEAM","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"EDIT","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"DNA","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"ABCL","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"EXAI","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"VKTX","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"IOVA","name":"Biotech & precision medicine","category":"Biotech & precision medicine","assetClass":"stocks"},{"symbol":"MP","name":"Advanced materials & critical minerals","category":"Advanced materials & critical minerals","assetClass":"stocks"},{"symbol":"CSTM","name":"Advanced materials & critical minerals","category":"Advanced materials & critical minerals","assetClass":"stocks"},{"symbol":"ATI","name":"Advanced materials & critical minerals","category":"Advanced materials & critical minerals","assetClass":"stocks"},{"symbol":"CRS","name":"Advanced materials & critical minerals","category":"Advanced materials & critical minerals","assetClass":"stocks"},{"symbol":"MTRN","name":"Advanced materials & critical minerals","category":"Advanced materials & critical minerals","assetClass":"stocks"},{"symbol":"AMR","name":"Advanced materials & critical minerals","category":"Advanced materials & critical minerals","assetClass":"stocks"},{"symbol":"PLL","name":"Advanced materials & critical minerals","category":"Advanced materials & critical minerals","assetClass":"stocks"},{"symbol":"IONR","name":"Advanced materials & critical minerals","category":"Advanced materials & critical minerals","assetClass":"stocks"},{"symbol":"TMC","name":"Advanced materials & critical minerals","category":"Advanced materials & critical minerals","assetClass":"stocks"},{"symbol":"EVEX","name":"Future mobility","category":"Future mobility","assetClass":"stocks"},{"symbol":"BLNK","name":"Future mobility","category":"Future mobility","assetClass":"stocks"},{"symbol":"CHPT","name":"Future mobility","category":"Future mobility","assetClass":"stocks"},{"symbol":"EVGO","name":"Future mobility","category":"Future mobility","assetClass":"stocks"},{"symbol":"ALGM","name":"Future mobility","category":"Future mobility","assetClass":"stocks"},{"symbol":"ON","name":"Future mobility","category":"Future mobility","assetClass":"stocks"},{"symbol":"NXPI","name":"Future mobility","category":"Future mobility","assetClass":"stocks"},{"symbol":"AI","name":"Cloud & next-generation software","category":"Cloud & next-generation software","assetClass":"stocks"},{"symbol":"C3AI","name":"Cloud & next-generation software","category":"Cloud & next-generation software","assetClass":"stocks"},{"symbol":"IOT","name":"Cloud & next-generation software","category":"Cloud & next-generation software","assetClass":"stocks"},{"symbol":"APP","name":"Cloud & next-generation software","category":"Cloud & next-generation software","assetClass":"stocks"},{"symbol":"SOUN","name":"Cloud & next-generation software","category":"Cloud & next-generation software","assetClass":"stocks"},{"symbol":"BBAI","name":"Cloud & next-generation software","category":"Cloud & next-generation software","assetClass":"stocks"},{"symbol":"DDOG","name":"Cloud & next-generation software","category":"Cloud & next-generation software","assetClass":"stocks"},{"symbol":"ESTC","name":"Cloud & next-generation software","category":"Cloud & next-generation software","assetClass":"stocks"},{"symbol":"MDB","name":"Cloud & next-generation software","category":"Cloud & next-generation software","assetClass":"stocks"},{"symbol":"SNOW","name":"Cloud & next-generation software","category":"Cloud & next-generation software","assetClass":"stocks"}],"futures":[{"symbol":"ES","name":"ES futures","assetClass":"futures"},{"symbol":"NQ","name":"NQ futures","assetClass":"futures"},{"symbol":"YM","name":"YM futures","assetClass":"futures"},{"symbol":"RTY","name":"RTY futures","assetClass":"futures"},{"symbol":"CL","name":"CL futures","assetClass":"futures"},{"symbol":"GC","name":"GC futures","assetClass":"futures"},{"symbol":"SI","name":"SI futures","assetClass":"futures"},{"symbol":"HG","name":"HG futures","assetClass":"futures"},{"symbol":"NG","name":"NG futures","assetClass":"futures"},{"symbol":"ZB","name":"ZB futures","assetClass":"futures"},{"symbol":"ZN","name":"ZN futures","assetClass":"futures"},{"symbol":"6E","name":"6E futures","assetClass":"futures"},{"symbol":"6J","name":"6J futures","assetClass":"futures"},{"symbol":"6B","name":"6B futures","assetClass":"futures"},{"symbol":"6A","name":"6A futures","assetClass":"futures"},{"symbol":"6C","name":"6C futures","assetClass":"futures"},{"symbol":"6S","name":"6S futures","assetClass":"futures"},{"symbol":"ZC","name":"ZC futures","assetClass":"futures"},{"symbol":"ZW","name":"ZW futures","assetClass":"futures"},{"symbol":"ZS","name":"ZS futures","assetClass":"futures"},{"symbol":"LE","name":"LE futures","assetClass":"futures"},{"symbol":"HE","name":"HE futures","assetClass":"futures"},{"symbol":"MES","name":"MES futures","assetClass":"futures"},{"symbol":"MNQ","name":"MNQ futures","assetClass":"futures"},{"symbol":"MYM","name":"MYM futures","assetClass":"futures"},{"symbol":"M2K","name":"M2K futures","assetClass":"futures"},{"symbol":"MCL","name":"MCL futures","assetClass":"futures"},{"symbol":"MGC","name":"MGC futures","assetClass":"futures"}]};
const loadLists=()=>{try{const x=JSON.parse(localStorage.getItem("rolyfe-chart-watchlists"));if(x&&Array.isArray(x.stocks)&&Array.isArray(x.crypto)){for(const group of ["stocks","crypto","discovery","futures"]){if(!Array.isArray(x[group]))x[group]=[];const seen=new Set(x[group].map(item=>item.symbol));(defaults[group]||[]).forEach(item=>{if(!seen.has(item.symbol))x[group].push({...item});});}return x;}}catch(e){}return JSON.parse(JSON.stringify(defaults));};
let lists=loadLists(),activeList="stocks",current="AAPL",interval="1d",candleStyle="standard",quotes={},chartObj=null,candleSeries=null,volumeSeries=null,vwapSeries=null,hmaSeries=null,maSeries={},resizeObserver=null,loadSequence=0,latestBars=[];
const urlParams=new URLSearchParams(location.search);
const requestedInterval=(urlParams.get("interval")||"1d").toLowerCase();if(["1d","4h","1h","15m","5m"].includes(requestedInterval))interval=requestedInterval;
let savedView={};try{savedView=JSON.parse(localStorage.getItem("rolyfe-live-desk-view")||"{}");}catch(e){savedView={};}
if(!urlParams.has("interval")&&["1d","4h","1h","15m","5m"].includes(savedView.interval))interval=savedView.interval;
if(!urlParams.has("symbol")){try{const savedSymbol=localStorage.getItem("rolyfe-live-desk-current");if(savedSymbol)current=symbolForApi(savedSymbol);}catch(e){}}
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:n<1?5:2}):"—";
const saveLists=()=>{try{localStorage.setItem("rolyfe-chart-watchlists",JSON.stringify(lists));}catch(e){}};
function symbolForApi(symbol){const s=symbol.trim().toUpperCase();if(/^[A-Z0-9.^_-]+$/.test(s))return s;return s.split(":").pop();}
function candleSymbolForApi(symbol){const s=symbolForApi(symbol);const crypto=s.match(/^([A-Z0-9]+)-USD$/);return crypto?"X:"+crypto[1]+"USD":s;}
function setupChart(){const root=$("#tvChart");root.innerHTML="";if(!window.LightweightCharts){root.innerHTML='<div class="loading">Chart library could not load. Check your connection and reload.</div>';$("#chartStatus").textContent="CHART LIBRARY ERROR";return false;}
chartObj=LightweightCharts.createChart(root,{width:root.clientWidth,height:root.clientHeight,layout:{background:{type:"solid",color:"#05070b"},textColor:"#b8c9dc"},grid:{vertLines:{color:"#15202d"},horzLines:{color:"#15202d"}},rightPriceScale:{borderColor:"#29384b"},timeScale:{borderColor:"#29384b",timeVisible:true,secondsVisible:false},crosshair:{mode:LightweightCharts.CrosshairMode.Normal},handleScroll:true,handleScale:true});
candleSeries=chartObj.addCandlestickSeries({upColor:"#50e0a2",downColor:"#ff7186",borderUpColor:"#50e0a2",borderDownColor:"#ff7186",wickUpColor:"#50e0a2",wickDownColor:"#ff7186"});
volumeSeries=chartObj.addHistogramSeries({priceFormat:{type:"volume"},priceScaleId:"volume",lastValueVisible:false,priceLineVisible:false});vwapSeries=chartObj.addLineSeries({color:"#f7d46a",lineWidth:2,title:"VWAP",priceLineVisible:false,lastValueVisible:true});hmaSeries=chartObj.addLineSeries({color:"#50e0a2",lineWidth:3,title:"HMA 32",priceLineVisible:false,lastValueVisible:true});const maColors={"5":"#f6c453","10":"#55d6be","20":"#6ea8fe","40":"#4fd1c5","50":"#c1a5ff","200":"#ff8c69"};[5,10,20,40,50,200].forEach(n=>{maSeries[n]=chartObj.addLineSeries({color:maColors[n],lineWidth:n===200?3:2,title:"EMA "+n,priceLineVisible:false,lastValueVisible:true});});
chartObj.priceScale("volume").applyOptions({scaleMargins:{top:.82,bottom:0},borderVisible:false});
chartObj.timeScale().fitContent();
if(resizeObserver)resizeObserver.disconnect();resizeObserver=new ResizeObserver(()=>{if(chartObj)chartObj.applyOptions({width:root.clientWidth,height:root.clientHeight});});resizeObserver.observe(root);
return true;}
function toHeikinAshi(bars){let previousOpen=null,previousClose=null;return bars.map((b)=>{const close=(b.open+b.high+b.low+b.close)/4;const open=previousOpen===null?(b.open+b.close)/2:(previousOpen+previousClose)/2;const high=Math.max(b.high,open,close);const low=Math.min(b.low,open,close);previousOpen=open;previousClose=close;return {time:b.time,open,high,low,close};});}
function renderCandles(){if(!candleSeries||!latestBars.length)return;const data=candleStyle==="heikinashi"?toHeikinAshi(latestBars):latestBars.map(({time,open,high,low,close})=>({time,open,high,low,close}));candleSeries.setData(data);const note=$("#candleStyleNote");if(note)note.textContent=candleStyle==="heikinashi"?"Heikin-Ashi smooths candles for trend reading; displayed OHLC values are synthetic, not executable prices.":"Standard candles show actual open, high, low and close.";const meta=$("#chartMeta");if(meta&&latestBars.length){const last=latestBars[latestBars.length-1];meta.textContent="Tickerbot · "+latestBars.length+" candles · "+interval+" · "+(candleStyle==="heikinashi"?"Heikin-Ashi view · actual last close ":"Standard candles · last close ")+fmt(last.close)+" · "+new Date(last.time*1000).toLocaleString();}}
async function loadBars(){const seq=++loadSequence;$("#chartStatus").textContent="LOADING CANDLES";$("#chartMeta").textContent="Requesting "+interval+" bars from Tickerbot…";renderTechnicalPosture(true);
if(!chartObj&&!setupChart())return;
const ticker=candleSymbolForApi(current);
try{const url=API+"?provider=tickerbot&symbol="+encodeURIComponent(ticker)+"&interval="+encodeURIComponent(interval)+"&limit=300";const r=await fetch(url,{headers:{apikey:ANON,Authorization:"Bearer "+ANON,Accept:"application/json"},cache:"no-store"});const d=await r.json();if(seq!==loadSequence)return;if(!r.ok)throw Error(d.error||d.message||("HTTP "+r.status));if(!Array.isArray(d.bars)||!d.bars.length)throw Error("No candles returned for this symbol and timeframe.");
const bars=d.bars.map(b=>({time:Math.floor(Number(b.t)/1000),open:Number(b.o),high:Number(b.h),low:Number(b.l),close:Number(b.c),volume:Number(b.v)||0})).filter(b=>Number.isFinite(b.time)&&Number.isFinite(b.open)&&Number.isFinite(b.high)&&Number.isFinite(b.low)&&Number.isFinite(b.close)).sort((a,b)=>a.time-b.time);
if(!bars.length)throw Error("Provider returned no valid OHLCV bars.");
latestBars=bars;renderCandles();
volumeSeries.setData(bars.map(b=>({time:b.time,value:b.volume,color:b.close>=b.open?"rgba(80,224,162,.38)":"rgba(255,113,134,.38)"})));
chartObj.timeScale().fitContent();renderMovingAverages();renderIndicator();renderTechnicalPosture(false);$("#chartStatus").textContent="CANDLES LOADED";const last=bars[bars.length-1];renderCandles();$("#chartMeta").textContent+=" · "+(d.coverage||"coverage not supplied");
}catch(e){if(seq!==loadSequence)return;latestBars=[];renderIndicator();renderTechnicalPosture(false);$("#chartStatus").textContent="DATA UNAVAILABLE";$("#chartMeta").textContent="Tickerbot candle request failed: "+e.message;$("#tvChart").dataset.error=e.message;}}

function renderMovingAverages(){
const host=$("#maReadout");if(!chartObj||!latestBars.length||!host)return;
const closes=latestBars.map(b=>b.close),labels=[];
[5,10,20,40,50,200].forEach(n=>{
 let p=null,k=2/(n+1);const values=closes.map((v,i)=>{p=p===null?v:v*k+p*(1-k);return i<n-1?null:p;});
 const control=Array.from(document.querySelectorAll(".ma-toggle")).find(el=>Number(el.value)===n),enabled=control?control.checked:n!==200,s=maSeries[n];
 if(!s)return;if(enabled){s.applyOptions({visible:true});s.setData(latestBars.map((b,i)=>({time:b.time,value:values[i]})).filter(x=>Number.isFinite(x.value)));if(values[values.length-1]!=null)labels.push("EMA "+n+" "+fmt(values[values.length-1]));}
 else{s.setData([]);s.applyOptions({visible:false});}
});
const wma=(values,period)=>values.map((_,i)=>{if(i<period-1)return null;let total=0,weight=0;for(let j=0;j<period;j++){const v=values[i-period+1+j];if(!Number.isFinite(v))return null;total+=v*(j+1);weight+=j+1;}return total/weight;});
const fastWma=wma(closes,16),slowWma=wma(closes,32),hmaDiff=closes.map((_,i)=>Number.isFinite(fastWma[i])&&Number.isFinite(slowWma[i])?2*fastWma[i]-slowWma[i]:null),hmaValues=wma(hmaDiff,6);
const hmaOn=$("#hmaToggle")?$("#hmaToggle").checked:true,hmaLast=hmaValues.at(-1),hmaPrior=hmaValues.at(-2),hmaBull=Number.isFinite(hmaLast)&&Number.isFinite(hmaPrior)&&closes.at(-1)>hmaLast&&hmaLast>hmaPrior,hmaBear=Number.isFinite(hmaLast)&&Number.isFinite(hmaPrior)&&closes.at(-1)<hmaLast&&hmaLast<hmaPrior;
if(hmaSeries){if(hmaOn){hmaSeries.applyOptions({visible:true,color:hmaBull?"#50e0a2":hmaBear?"#ff7186":"#f0c36b"});hmaSeries.setData(latestBars.map((b,i)=>({time:b.time,value:hmaValues[i]})).filter(x=>Number.isFinite(x.value)));if(Number.isFinite(hmaLast))labels.push("HMA 32 "+fmt(hmaLast));}else{hmaSeries.setData([]);hmaSeries.applyOptions({visible:false});}}
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

let currentMoneyness="ATM",currentOptionSide="call",optionChainData=[],selectedOptionContract=null;
function ladderMoney(n){return Number.isFinite(n)?new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(n):"—";}
function calculateStockLadder(){
 const entry=Number($("#stockEntry")?.value),stop=Number($("#stockStop")?.value),budget=Number($("#stockRiskBudget")?.value),qtyRaw=$("#stockQty")?.value.trim(),orderType=$("#stockOrderType")?.value||"buy-market",isLong=orderType.startsWith("buy"),distance=Math.abs(entry-stop);
 const valid=Number.isFinite(entry)&&entry>0&&Number.isFinite(stop)&&stop>0&&(isLong?stop<entry:stop>entry)&&Number.isFinite(budget)&&budget>0;
 const out=$("#stockLadderOutput");if(!out)return null;
 if(!valid){out.textContent="Enter a valid entry, a protective stop on the correct side of entry, and a positive maximum risk budget. Buy/Long stops must be below entry; Sell/Short stops must be above entry.";return null;}
 const maxShares=Math.floor(budget/distance),shares=qtyRaw?Math.floor(Number(qtyRaw)):maxShares;
 if(!Number.isInteger(shares)||shares<1){out.textContent="The risk budget is too small for one share at this stop distance, or the share quantity is invalid.";return null;}
 const risk=distance*shares,position=entry*shares,targets=[1,2,3].map(r=>({r,price:entry+(isLong?1:-1)*distance*r}));
 const plan={symbol:current,side:isLong?"BUY / LONG":"SELL / SHORT",orderType,entry,stop,shares,maxShares,risk,budget,position,targets,riskPerShare:distance,withinBudget:risk<=budget};
 out.innerHTML='<div class="result-grid"><div><small>Underlying</small><strong>'+plan.symbol+'</strong></div><div><small>Entry type</small><strong>'+plan.orderType.replace(/-/g," ").toUpperCase()+'</strong></div><div><small>Planned entry</small><strong>'+ladderMoney(entry)+'</strong></div><div><small>Protective stop</small><strong>'+ladderMoney(stop)+'</strong></div><div><small>Risk per share</small><strong>'+ladderMoney(distance)+'</strong></div><div><small>Shares</small><strong>'+shares+' / '+maxShares+' max</strong></div><div><small>Position value</small><strong>'+ladderMoney(position)+'</strong></div><div><small>Planned dollar risk</small><strong>'+ladderMoney(risk)+'</strong></div><div><small>Risk budget status</small><strong>'+(plan.withinBudget?"Within budget":"OVER BUDGET")+'</strong></div>'+targets.map(t=>'<div><small>'+t.r+'R target</small><strong>'+ladderMoney(t.price)+'</strong></div>').join("")+'</div><p class="stock-explain">'+(plan.withinBudget?"Position risk is within the selected budget.":"Risk exceeds the selected budget; reduce shares or adjust the plan before reviewing.")+' Targets use the entry-to-stop distance multiplied by R. These are planned levels, not predictions.</p>';
 return plan;
}
function stockAtr14(){
 const bars=latestBars||[];if(bars.length<15)return null;const tail=bars.slice(-15),ranges=[];
 for(let i=1;i<tail.length;i++){const b=tail[i],p=tail[i-1],h=Number(b.high),l=Number(b.low),pc=Number(p.close);if(![h,l,pc].every(Number.isFinite))continue;ranges.push(Math.max(h-l,Math.abs(h-pc),Math.abs(l-pc)));}
 return ranges.length>=14?ranges.slice(-14).reduce((a,b)=>a+b,0)/ranges.length:null;
}
function suggestStockStop(){
 const q=quotes[current];if(!q||!Number.isFinite(q.price)||q.price<=0){$("#stockQuoteContext").textContent="A verified underlying price is required before suggesting a stop.";return;}
 const atr=stockAtr14();if(!atr||atr<=0){$("#stockQuoteContext").textContent="ATR(14) needs at least 15 valid chart bars. No stop was guessed.";return;}
 const mult=Number($("#stockAtrMultiple").value)||1,isLong=$("#stockOrderType").value.startsWith("buy"),entry=q.price;
 $("#stockEntry").value=entry.toFixed(4);$("#stockStop").value=(entry+(isLong?-1:1)*atr*mult).toFixed(4);
 $("#stockQuoteContext").textContent="Entry from "+(q.provider||"provider")+" quote · ATR(14) "+ladderMoney(atr)+" × "+mult+" · "+(q.stamp||"timestamp not supplied");calculateStockLadder();
}
function prepareStockOrder(){
 const plan=calculateStockLadder();if(!plan){$("#stockOrderPreview").textContent="Draft not prepared. Correct the stock ladder inputs first.";return;}
 $("#stockOrderPreview").textContent="ORDER DRAFT — NOT SUBMITTED\n"+plan.side+" "+plan.shares+" shares of "+plan.symbol+" · "+plan.orderType.replace(/-/g," ").toUpperCase()+"\nPlanned entry: "+ladderMoney(plan.entry)+" · Protective stop: "+ladderMoney(plan.stop)+"\nEstimated position value: "+ladderMoney(plan.position)+" · Modeled stop risk: "+ladderMoney(plan.risk)+"\nTargets: "+plan.targets.map(t=>t.r+"R "+ladderMoney(t.price)).join(" · ")+"\nWorksheet draft only. No brokerage is connected and no order has been transmitted.";
}
function sendCurrentToStock(){
 const q=quotes[current];$("#stockUnderlying").textContent=current;
 if(q&&Number.isFinite(q.price)){$("#stockEntry").value=q.price.toFixed(4);$("#stockQuoteContext").textContent=(q.provider||"Provider")+" · "+(q.stamp||"timestamp not supplied")+" · verify recency";calculateStockLadder();}
 $("#stock-ladder").scrollIntoView({behavior:"smooth",block:"start"});
}
function sendCurrentToOption(){
 $("#optionUnderlying").textContent=current;
 $("#optionChainStatus").textContent="Underlying "+current+" selected. Loading the selected call/put chain so you can review ATM, ITM and OTM contracts. The stock price is not an option premium.";
 $("#option-ladder").scrollIntoView({behavior:"smooth",block:"start"});
 loadMassiveOptionChain();
}
function optionMoneyness(contract,spot,side){
 if(!Number.isFinite(spot)||spot<=0)return "UNKNOWN";const pct=Math.abs(contract.strike-spot)/spot;
 if(pct<=0.005)return "ATM";if(side==="call")return contract.strike<spot?"ITM":"OTM";return contract.strike>spot?"ITM":"OTM";
}
function renderOptionContracts(){
 const select=$("#optionContractSelect");if(!select)return;const spot=Number(quotes[current]?.price||optionChainData.find(x=>x.underlyingPrice)?.underlyingPrice);
 const sorted=optionChainData.filter(x=>x.contractType===currentOptionSide&&Number.isFinite(x.strike)).sort((a,b)=>a.strike-b.strike);
 const filtered=sorted.filter(x=>optionMoneyness(x,spot,currentOptionSide)===currentMoneyness);select.innerHTML="";
 if(!filtered.length){const option=document.createElement("option");option.value="";option.textContent="No "+currentMoneyness+" contracts returned for this expiration/side.";select.append(option);return;}
 filtered.forEach(c=>{const option=document.createElement("option");option.value=optionChainData.indexOf(c);const mid=c.bid>0&&c.ask>=c.bid?(c.bid+c.ask)/2:null,spread=mid?(c.ask-c.bid)/mid*100:null;option.textContent=(c.ticker||"Contract")+" · $"+c.strike.toFixed(2)+" · "+currentMoneyness+" · "+(spread!==null?"Spread "+spread.toFixed(1)+"%":"Quote unavailable");select.append(option);});
 select.selectedIndex=0;select.dispatchEvent(new Event("change"));
}
async function loadMassiveOptionChain(){
 const status=$("#optionChainStatus"),symbol=symbolForApi(current);
 if(/-USD$/.test(current)||current.startsWith("X:")){status.textContent="Listed U.S. equity options are not available for this crypto symbol in this chain. Select a supported stock/ETF underlying.";return;}
 status.textContent="Requesting "+currentOptionSide.toUpperCase()+" chain from Massive…";
 const params=new URLSearchParams({provider:"massive-options-chain",symbol,contract_type:currentOptionSide,limit:"250"}),expiry=$("#chainExpiry").value;if(expiry)params.set("expiration_date",expiry);
 try{
  const response=await fetch(API+"?"+params.toString(),{headers:{apikey:ANON,Authorization:"Bearer "+ANON,Accept:"application/json"},cache:"no-store"});const data=await response.json();if(!response.ok)throw Error(data.error||"Massive option chain unavailable.");
  optionChainData=Array.isArray(data.contracts)?data.contracts:[];
  if(!optionChainData.length){status.textContent="Massive returned no contracts. Check expiry, options plan entitlement and ticker coverage.";$("#optionContractSelect").innerHTML='<option value="">No contracts returned</option>';return;}
  const expiries=[...new Set(optionChainData.map(x=>x.expirationDate).filter(Boolean))].sort();
  if(!expiry&&expiries.length)$("#chainExpiry").value=expiries[0];
  if(expiry)optionChainData=optionChainData.filter(x=>x.expirationDate===expiry);
  status.textContent="Massive provider response · "+optionChainData.length+" contract(s) · "+(optionChainData[0]?.expirationDate||"expiration not supplied")+" · quote delay/recency depends on the account and provider timestamp.";
  renderOptionContracts();
 }catch(error){optionChainData=[];$("#optionContractSelect").innerHTML='<option value="">Option chain unavailable</option>';$("#optionQuoteDetails").textContent=error.message;status.textContent=error.message;}
}
function applySelectedOptionContract(){
 const index=Number($("#optionContractSelect")?.value);if(!Number.isInteger(index))return;const c=optionChainData[index];if(!c)return;selectedOptionContract=c;
 const spot=Number(quotes[current]?.price||c.underlyingPrice),money=optionMoneyness(c,spot,currentOptionSide);
 $("#optType").value=currentOptionSide==="call"?"Call":"Put";$("#optStrike").value=String(c.strike);$("#optExpiry").value=c.expirationDate||"";
 $("#popupStrike").value=String(c.strike);$("#popupSide").value=currentOptionSide;
 if(Number.isFinite(c.impliedVolatility)&&c.impliedVolatility>0)$("#popupIv").value=String(c.impliedVolatility<=5?c.impliedVolatility*100:c.impliedVolatility);
 let premium=null,source="No current two-sided quote";
 if(c.bid>0&&c.ask>=c.bid){premium=(c.bid+c.ask)/2;source="NBBO midpoint";$("#optEntry").value=premium.toFixed(4);}
 else if(c.last>0){premium=c.last;source="Last trade only · not a current two-sided quote";$("#optEntry").value=premium.toFixed(4);}
 const spread=c.bid>0&&c.ask>=c.bid?c.ask-c.bid:null,spreadPct=spread!==null&&premium>0?spread/premium*100:null;
 $("#optionQuoteDetails").textContent=["Contract: "+(c.ticker||"not supplied"),"Moneyness: "+money,"Underlying: "+ladderMoney(spot),"Bid: "+ladderMoney(c.bid),"Ask: "+ladderMoney(c.ask),"Midpoint: "+(c.bid>0&&c.ask>=c.bid?ladderMoney((c.bid+c.ask)/2):"Unavailable"),"Last trade: "+ladderMoney(c.last),"Spread: "+(spread!==null?ladderMoney(spread)+" ("+spreadPct.toFixed(1)+"%)":"Unavailable"),"Premium source: "+source,"IV: "+(Number.isFinite(c.impliedVolatility)?(c.impliedVolatility*100).toFixed(1)+"%":"Unavailable"),"Delta / Gamma / Theta / Vega: "+(c.greeks?["delta","gamma","theta","vega"].map(k=>k+" "+(c.greeks[k]??"—")).join(" · "):"Unavailable"),"Open interest: "+(c.openInterest??"Unavailable")+" · Volume: "+(c.volume??"Unavailable")].join("\n");
 if(premium!==null){$("#greekStatus").textContent=source+" · Provider timestamp "+(c.quoteTimestamp||c.tradeTimestamp||"not supplied")+". Verify bid/ask and market hours.";renderOptionLadder();updatePopupGreeks();}
 else $("#optionChainStatus").textContent="Contract selected, but no usable bid/ask midpoint or last trade was returned. Premium fields were not filled.";
}

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

function renderTechnicalPosture(loading){
 const panel=$("#technicalPosturePanel"),badge=$("#technicalPostureBadge"),copy=$("#technicalPostureCopy"),metrics=$("#technicalPostureMetrics"),tf=$("#technicalPostureTimeframe");
 if(!panel||!badge||!copy||!metrics)return;
 tf.textContent="Selected chart · "+String(interval||"").toUpperCase();
 panel.classList.remove("bullish","bearish");panel.classList.add("neutral");
 if(loading){badge.textContent="◌ UPDATING";copy.textContent="Loading the selected ticker and timeframe. The previous reading is being replaced.";metrics.textContent="Waiting for fresh candle data…";return;}
 if(!latestBars.length){badge.textContent="⏸ NEUTRAL / WAITING";copy.textContent="No usable candles returned. Check the selected symbol, timeframe, provider coverage, and refresh.";metrics.textContent="EMA 20 / 50 · —   |   RSI 14 · —   |   MACD · —   |   Stoch · —";return;}
 const bars=latestBars,closes=bars.map(b=>b.close),highs=bars.map(b=>b.high),lows=bars.map(b=>b.low);
 if(bars.length<50){badge.textContent="⏸ NEUTRAL / WAITING";copy.textContent="Need at least 50 valid candles on this timeframe before assigning a directional posture. Current: "+bars.length+".";metrics.textContent="EMA 20 / 50 · building   |   RSI 14 · building   |   MACD · building   |   Stoch · building";return;}
 const emaSeries=(values,period)=>{
  const out=Array(values.length).fill(null),k=2/(period+1);let seed=0,prev=null,count=0;
  values.forEach((v,i)=>{if(!Number.isFinite(v))return;if(prev===null){seed+=v;count++;if(count===period){prev=seed/period;out[i]=prev;}}else{prev=v*k+prev*(1-k);out[i]=prev;}});
  return out;
 };
 const ema20=emaSeries(closes,20),ema50=emaSeries(closes,50);
 const e20=ema20[ema20.length-1],e50=ema50[ema50.length-1],last=closes[closes.length-1];
 let avgGain=0,avgLoss=0,rsi=NaN;
 for(let i=1;i<=14;i++){const d=closes[i]-closes[i-1];avgGain+=Math.max(d,0)/14;avgLoss+=Math.max(-d,0)/14;}
 for(let i=15;i<closes.length;i++){const d=closes[i]-closes[i-1];avgGain=(avgGain*13+Math.max(d,0))/14;avgLoss=(avgLoss*13+Math.max(-d,0))/14;}
 rsi=avgLoss===0?100:100-100/(1+avgGain/avgLoss);
 const fast=emaSeries(closes,12),slow=emaSeries(closes,26);
 const macdLine=fast.map((v,i)=>v===null||slow[i]===null?null:v-slow[i]);
 const signal=emaSeries(macdLine.map(v=>v===null?NaN:v),9);
 const macdHist=macdLine[macdLine.length-1]-signal[signal.length-1];
 const rawK=bars.map((b,i)=>{if(i<13)return null;const hi=Math.max(...highs.slice(i-13,i+1)),lo=Math.min(...lows.slice(i-13,i+1));return hi===lo?50:100*(b.close-lo)/(hi-lo);});
 const validK=rawK.filter(Number.isFinite),stochK=validK[validK.length-1],stochD=validK.slice(-3).reduce((a,v)=>a+v,0)/Math.min(3,validK.length);
 const ready=[e20,e50,rsi,macdHist,stochK,stochD,last].every(Number.isFinite);
 if(!ready){badge.textContent="⏸ NEUTRAL / WAITING";copy.textContent="Some required studies are incomplete for this provider response. No directional posture assigned.";metrics.textContent="EMA / RSI / MACD / Stoch · incomplete";return;}
 let score=0;
 const alignedUp=last>e20&&e20>e50,alignedDown=last<e20&&e20<e50;
 if(alignedUp)score+=2;else if(alignedDown)score-=2;
 if(rsi>=55)score++;else if(rsi<=45)score--;
 if(macdHist>0)score++;else if(macdHist<0)score--;
 if(stochK>stochD)score++;else if(stochK<stochD)score--;
 let posture="neutral",label="⏸ NEUTRAL / WAITING",explain="Signals are mixed or lack enough alignment. Wait for price, trend and momentum to agree.";
 if(score>=3&&alignedUp){posture="bullish";label="🏹 ↑ BULLISH";explain="Price is above rising EMA 20 / EMA 50 alignment, with momentum confirmation on this timeframe.";}
 else if(score<=-3&&alignedDown){posture="bearish";label="🏹 ↓ BEARISH";explain="Price is below falling EMA 20 / EMA 50 alignment, with downside momentum confirmation on this timeframe.";}
 panel.classList.remove("bullish","bearish","neutral");panel.classList.add(posture);
 badge.textContent=label;copy.textContent=explain+" Score "+(score>0?"+":"")+score+" · "+bars.length+" candles.";
 const signed=n=>(n>0?"+":"")+Number(n).toFixed(4);
 metrics.innerHTML="<span>EMA 20 / 50 · "+fmt(e20)+" / "+fmt(e50)+"</span><span>RSI 14 · "+rsi.toFixed(1)+"</span><span>MACD hist · "+signed(macdHist)+"</span><span>Stoch K / D · "+stochK.toFixed(1)+" / "+stochD.toFixed(1)+"</span>";
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
const wilder=(a,n)=>{
 const out=Array(a.length).fill(null);let seed=0,count=0,prev=null;
 a.forEach((v,i)=>{
  if(v===null||!Number.isFinite(v))return;
  if(prev===null){seed+=v;count++;if(count===n){prev=seed/n;out[i]=prev;}}
  else{prev=((prev*(n-1))+v)/n;out[i]=prev;}
 });
 return out;
};
const ema=(a,n)=>{let p=null,k=2/(n+1);return a.map((v,i)=>{if(v===null||!Number.isFinite(v))return null;p=p===null?v:v*k+p*(1-k);return i<n-1?null:p;});};
const tr=bars.map((b,i)=>i===0?b.high-b.low:Math.max(b.high-b.low,Math.abs(b.high-bars[i-1].close),Math.abs(b.low-bars[i-1].close)));
const atrValues=wilder(tr,14);
let vals=[],guides=[],label="",color="#78a9ff",suffix="",modeText="",histogram=false;
if(mode==="rsi"){
 label="RSI (14)";guides=[30,70];
 let gain=0,loss=0;
 vals=cl.map((v,i)=>{if(i===0)return null;const d=v-cl[i-1];if(i<=14){gain+=Math.max(d,0)/14;loss+=Math.max(-d,0)/14;if(i<14)return null;}else{gain=(gain*13+Math.max(d,0))/14;loss=(loss*13+Math.max(-d,0))/14;}return loss===0?100:100-100/(1+gain/loss);});
}else if(mode==="hma"){
 label="Hull Moving Average (32)";color="#50e0a2";
 const weighted=(values,n)=>values.map((_,i)=>{if(i<n-1)return null;let total=0,weight=0;for(let j=0;j<n;j++){const v=values[i-n+1+j];if(!Number.isFinite(v))return null;total+=v*(j+1);weight+=j+1;}return total/weight;});
 const f=weighted(cl,16),s=weighted(cl,32),d=cl.map((_,i)=>Number.isFinite(f[i])&&Number.isFinite(s[i])?2*f[i]-s[i]:null);
 vals=weighted(d,6);
 const lastH=vals.at(-1),priorH=vals.at(-2);
 modeText=Number.isFinite(lastH)?"HMA "+lastH.toFixed(3)+" · "+(cl.at(-1)>lastH&&lastH>priorH?"BULLISH":cl.at(-1)<lastH&&lastH<priorH?"BEARISH":"MIXED"):"HMA forming";
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
 const pAvg=wilder(plus,14),mAvg=wilder(minus,14);
 const dx=bars.map((b,i)=>{if(!atrValues[i]||pAvg[i]===null||mAvg[i]===null)return null;const p=100*pAvg[i]/atrValues[i],m=100*mAvg[i]/atrValues[i],sum=p+m;return sum?100*Math.abs(p-m)/sum:null;});
 vals=wilder(dx,14);
}else if(mode==="bollinger"){
 label="Bollinger %B (20,2)";guides=[0,50,100];color="#78a9ff";
 vals=bars.map((b,i)=>{if(i<19)return null;const w=cl.slice(i-19,i+1),avg=mean(w),sd=Math.sqrt(mean(w.map(x=>(x-avg)*(x-avg)))),u=avg+2*sd,l=avg-2*sd;return u===l?50:100*(b.close-l)/(u-l);});
}else if(mode==="obv"){
 label="On-Balance Volume";color="#55e0a3";
 let total=0;vals=bars.map((b,i)=>{if(i>0){if(b.close>bars[i-1].close)total+=vol[i];else if(b.close<bars[i-1].close)total-=vol[i];}return total;});
}else if(mode==="ttm"){
 label="TTM Squeeze · momentum proxy";guides=[0];color="#c1a5ff";histogram=true;
 const mid=sma(cl,20),atr20=wilder(tr,20),ema20=ema(cl,20),states=[];
 vals=bars.map((b,i)=>{if(i<19||mid[i]===null||atr20[i]===null||ema20[i]===null){states.push(null);return null;}const w=cl.slice(i-19,i+1),sd=Math.sqrt(mean(w.map(x=>(x-mid[i])*(x-mid[i])))),bbU=mid[i]+2*sd,bbL=mid[i]-2*sd,kcU=ema20[i]+1.5*atr20[i],kcL=ema20[i]-1.5*atr20[i];states.push(bbU<kcU&&bbL>kcL);return b.close-mid[i];});
 modeText=states[states.length-1]===null?"Squeeze unavailable":states[states.length-1]?"SQUEEZE ON":"SQUEEZE RELEASED";
}else if(mode==="supertrend"){
 label="Supertrend (10,3) direction";guides=[0];color="#55e0a3";histogram=true;
 const atr10=wilder(tr,10),upper=[],lower=[],trend=[];
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
}function chart(symbol,showPopup=true){const nextSymbol=symbolForApi(symbol);if(nextSymbol!==current){optionChainData=[];selectedOptionContract=null;if($("#optionContractSelect"))$("#optionContractSelect").innerHTML='<option value="">Load a chain to choose a contract</option>';if($("#optionQuoteDetails"))$("#optionQuoteDetails").textContent="Bid · Ask · Midpoint · Last trade · IV · Greeks · Open interest · Volume";if($("#optionChainStatus"))$("#optionChainStatus").textContent="Underlying changed to "+nextSymbol+". Load its option chain before reviewing a contract.";}current=nextSymbol;try{localStorage.setItem("rolyfe-live-desk-current",current);}catch(e){}$("#symbolSearch").value=current;$("#stockUnderlying").textContent=current;$("#optionUnderlying").textContent=current;$("#chartHeading").textContent=current;try{if(window.parent&&window.parent!==window)window.parent.postMessage({type:"rol-live-chart-symbol",symbol:current},location.origin);}catch(e){}if(new URLSearchParams(location.search).get("embed")==="classroom"){try{const parentSelect=window.parent.document.getElementById("classroomSymbol");if(parentSelect){let match=Array.from(parentSelect.options).find(o=>o.value===current);if(!match){match=document.createElement("option");match.value=current;match.textContent=current+" — Custom";parentSelect.add(match);}parentSelect.value=current;}}catch(e){}}renderList();renderOptionLadder();const selected=findItem(current);loadBars();showQuote(selected).catch(()=>{});if(showPopup)openQuotePopup(selected);}
function findItem(symbol){for(const group of Object.values(lists)){const x=group.find(a=>a.symbol===symbol||a.symbol===symbolForApi(symbol));if(x)return x;}return {symbol,name:symbol.split(":").pop()};}
async function getQuote(item){
if(item.assetClass==="futures"||(activeList==="futures"&&/^(ES|NQ|YM|RTY|CL|GC|SI|HG|NG|ZB|ZN|6E|6J|6B|6A|6C|6S|ZC|ZW|ZS|LE|HE|MES|MNQ|MYM|M2K|MCL|MGC)$/.test(item.symbol)))throw Error("Futures are listed in the workspace, but a verified futures quote / chart entitlement is not connected yet. No sample price is substituted.");
const crypto=Boolean(item.api)||/-USD$/.test(item.symbol),ticker=crypto?("X:"+((item.api||item.symbol.split("-")[0]).replace(/[^A-Z0-9]/g,""))+"USD"):symbolForApi(item.symbol);
const headers={apikey:ANON,Authorization:"Bearer "+ANON,Accept:"application/json"};
if(!crypto){try{const massiveUrl=API+"?provider=massive-stock-snapshot&symbol="+encodeURIComponent(ticker);const mr=await fetch(massiveUrl,{headers,cache:"no-store"}),md=await mr.json();if(mr.ok&&Number.isFinite(Number(md.price))&&Number(md.price)>0){const ts=Number(md.timestamp),stamp=ts?(new Date(ts>1e15?ts/1e6:ts>1e12?ts:ts*1000)).toLocaleString():"provider timestamp not supplied";return {price:Number(md.price),change:md.changePercent===null||md.changePercent===undefined?NaN:Number(md.changePercent),provider:"Massive",stamp,bid:md.bid,ask:md.ask,signals:null,dataStatus:"provider_response"};}}catch(e){}}
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
try{const q=await getQuote(item);quotes[item.symbol]=q;notifyParentQuote(item,q);$("#quotePrice").textContent=fmt(q.price);$("#quoteChange").textContent=(Number.isFinite(q.change)?(q.change>0?"+":"")+q.change.toFixed(2)+"%  ·  24-hour change":"Change not supplied");$("#quoteChange").className="change "+(q.change<0?"negative":q.change>0?"positive":"");$("#quoteMeta").textContent=q.provider+" · provider response · "+q.stamp+" · Not a guaranteed real-time quote";$("#stockQuoteContext").textContent=q.provider+" · "+q.stamp+" · verify recency";$("#stockUnderlying").textContent=current;renderList();if($("#stockEntry")&&!$("#stockEntry").value)$("#stockEntry").value=q.price.toFixed(4);}
catch(e){$("#quotePrice").textContent="Quote unavailable";$("#quoteChange").textContent="Provider did not return a usable quote";$("#quoteMeta").textContent="Check ticker, provider entitlement or usage limits. Candle feed is independent.";}}
function renderList(){const root=$("#watchlist");root.innerHTML="";lists[activeList].forEach(item=>{const q=quotes[item.symbol];const b=document.createElement("button");b.type="button";b.className="watch-item"+(item.symbol===current?" active":"");const left=document.createElement("span"),right=document.createElement("span"),sym=document.createElement("strong"),name=document.createElement("small"),price=document.createElement("strong"),delta=document.createElement("small");sym.className="sym";sym.textContent=item.symbol.split(":").pop();name.textContent=item.name;left.append(sym,name);price.className="price";price.textContent=q?fmt(q.price):"—";delta.className="delta"+(q&&q.change<0?" negative":q&&q.change>0?" positive":"");delta.textContent=q&&Number.isFinite(q.change)?(q.change>0?"+":"")+q.change.toFixed(2)+"%":"Quote pending";right.append(price,delta);b.append(left,right);b.addEventListener("click",()=>chart(item.symbol));root.append(b);});}
function addSymbol(raw){let symbol=raw.trim().toUpperCase();if(!symbol)return;if(symbol.includes(":"))symbol=symbol.split(":").pop();if(!/^[A-Z0-9.^_-]{1,20}$/.test(symbol))return;const list=lists[activeList]||lists.stocks;if(list.some(x=>x.symbol===symbol)){chart(symbol);return;}const item={symbol,name:symbol,assetClass:activeList==="futures"?"futures":activeList==="crypto"?"crypto":"stocks"};if(activeList==="crypto"&&!symbol.endsWith("-USD")){item.symbol=symbol+"-USD";item.api=symbol;}list.push(item);saveLists();renderList();chart(item.symbol);}

function scanRender(rows){
 const host=$("#scannerResults");host.innerHTML="";
 if(!rows.length){host.textContent="No provider results returned for this list.";return;}
 rows.forEach(row=>{
  const wrap=document.createElement("div");wrap.className="scan-row";const left=document.createElement("div"),right=document.createElement("div"),sym=document.createElement("strong"),meta=document.createElement("small"),button=document.createElement("button");
  sym.textContent=row.ticker||row.symbol||"Unknown";meta.textContent="Price "+(Number.isFinite(Number(row.price))?ladderMoney(Number(row.price)):"—")+" · Chg "+(Number.isFinite(Number(row.change_1d_pct))?Number(row.change_1d_pct).toFixed(2)+"%":"—")+" · RVOL "+(row.relative_volume??"—")+" · RSI "+(row.rsi_14??"—");
  left.append(sym,meta);button.type="button";button.textContent="Load chart";button.addEventListener("click",()=>chart(row.ticker||row.symbol,false));right.append(button);wrap.append(left,right);host.append(wrap);
 });
}
async function scanWatchlist(){
 const type=$("#scannerAssetClass").value,status=$("#scannerStatus"),button=$("#scanWatchlist");
 if(type==="futures"){status.textContent="Futures symbols are listed, but verified futures scanner data is not connected. No simulated rows are shown.";$("#scannerResults").textContent="Futures feed not connected.";return;}
 const items=lists[type]||[];if(!items.length){status.textContent="No symbols in this watchlist.";return;}
 button.disabled=true;status.textContent="Scanning "+items.length+" symbols from the "+type+" watchlist…";
 try{
  const symbols=items.map(x=>type==="crypto"?(x.api?("X:"+x.api+"USD"):"X:"+x.symbol.replace(/-USD$/,"")+"USD"):x.symbol),batches=[];
  for(let i=0;i<symbols.length;i+=100)batches.push(symbols.slice(i,i+100));
  const all=[];
  for(const batch of batches){const params=new URLSearchParams({provider:"tickerbot-scan",asset_class:type==="crypto"?"crypto":"stocks",symbols:batch.join(","),limit:String(batch.length)});const response=await fetch(API+"?"+params.toString(),{headers:{apikey:ANON,Authorization:"Bearer "+ANON,Accept:"application/json"},cache:"no-store"});const data=await response.json();if(!response.ok)throw Error(data.error||"Scanner request failed.");if(Array.isArray(data.results))all.push(...data.results);}
  const rows=all.sort((a,b)=>Number(b.relative_volume||0)-Number(a.relative_volume||0));scanRender(rows);status.textContent="Tickerbot returned "+rows.length+" result(s) from "+items.length+" requested symbols · scan request completed "+new Date().toLocaleTimeString()+" (not a provider quote timestamp). Check liquidity and recency.";
 }catch(error){status.textContent=error.message;$("#scannerResults").textContent="Scanner did not return verified results.";}
 finally{button.disabled=false;}
}
$("#scanWatchlist")?.addEventListener("click",scanWatchlist);
$("#stockOrderType")?.addEventListener("change",calculateStockLadder);
["stockEntry","stockStop","stockRiskBudget","stockQty"].forEach(id=>$("#"+id)?.addEventListener("input",calculateStockLadder));
$("#suggestStockStop")?.addEventListener("click",suggestStockStop);
$("#calculateStockPlan")?.addEventListener("click",calculateStockLadder);
$("#prepareStockOrder")?.addEventListener("click",prepareStockOrder);
$("#stockToOption")?.addEventListener("click",sendCurrentToOption);
$("#sendToStockLadder")?.addEventListener("click",sendCurrentToStock);
$("#sendToOptionLadder")?.addEventListener("click",sendCurrentToOption);
$("#loadOptionChain")?.addEventListener("click",loadMassiveOptionChain);
$("#chainExpiry")?.addEventListener("change",()=>{if(optionChainData.length)loadMassiveOptionChain();});
document.querySelectorAll("[data-chain-side]").forEach(b=>b.addEventListener("click",()=>{currentOptionSide=b.dataset.chainSide;document.querySelectorAll("[data-chain-side]").forEach(x=>x.classList.toggle("active",x===b));if(optionChainData.length)loadMassiveOptionChain();}));
document.querySelectorAll("[data-moneyness]").forEach(b=>b.addEventListener("click",()=>{currentMoneyness=b.dataset.moneyness;document.querySelectorAll("[data-moneyness]").forEach(x=>x.classList.toggle("active",x===b));renderOptionContracts();}));
$("#optionContractSelect")?.addEventListener("change",applySelectedOptionContract);
$("#expandChartBtn")?.addEventListener("click",()=>{const layout=$(".layout"),expanded=layout.classList.toggle("chart-expanded");$("#expandChartBtn").textContent=expanded?"↙ Collapse Chart":"↗ Expand Chart";const root=$("#tvChart");if(root){root.style.height=expanded?"660px":"";if(chartObj)requestAnimationFrame(()=>chartObj.applyOptions({width:root.clientWidth,height:root.clientHeight}));}});

$("#loadSymbol").addEventListener("click",()=>chart($("#symbolSearch").value.trim()||"AAPL"));
$("#symbolSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();chart($("#symbolSearch").value.trim());}});
document.querySelectorAll("[data-symbol]").forEach(b=>b.addEventListener("click",()=>chart(b.dataset.symbol)));
document.querySelectorAll("[data-list]").forEach(b=>b.addEventListener("click",()=>{activeList=b.dataset.list;document.querySelectorAll("[data-list]").forEach(x=>x.classList.toggle("active",x===b));renderList();}));
document.querySelectorAll("[data-interval]").forEach(b=>b.addEventListener("click",()=>{interval=b.dataset.interval;document.querySelectorAll("[data-interval]").forEach(x=>x.classList.toggle("active",x===b));saveDeskView();loadBars();}));
$("#refreshBars").addEventListener("click",loadBars);$("#vwapToggle")?.addEventListener("change",()=>{renderMovingAverages();saveDeskView();});$("#hmaToggle")?.addEventListener("change",()=>{renderMovingAverages();saveDeskView();});$("#candleStyle").addEventListener("change",e=>{candleStyle=e.target.value;renderCandles();saveDeskView();});$("#indicatorSelect").addEventListener("change",()=>{renderIndicator();saveDeskView();});document.querySelectorAll(".ma-toggle").forEach(el=>el.addEventListener("change",()=>{renderMovingAverages();saveDeskView();}));document.querySelectorAll("#option-ladder input,#option-ladder select").forEach(el=>{el.addEventListener("input",renderOptionLadder);el.addEventListener("change",renderOptionLadder);});
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
function saveDeskView(){try{localStorage.setItem("rolyfe-live-desk-view",JSON.stringify({interval,candleStyle,indicator:$("#indicatorSelect")?.value,vwap:$("#vwapToggle")?.checked,hma:$("#hmaToggle")?.checked,ma:Object.fromEntries([...document.querySelectorAll(".ma-toggle")].map(el=>[el.value,el.checked]))}));}catch(e){}}
window.ROLyfeChartDesk={
 setSymbol:(symbol)=>{chart(symbol,false);return current;},
 setInterval:(value)=>{const v=String(value||"").toLowerCase();if(!["1d","4h","1h","15m","5m"].includes(v))return false;interval=v;document.querySelectorAll("[data-interval]").forEach(b=>b.classList.toggle("active",b.dataset.interval===interval));loadBars();return true;},
 refresh:loadBars,
 setChartHeight:(height)=>{const h=Math.max(300,Math.min(760,Number(height)||500)),root=$("#tvChart");if(root)root.style.height=h+"px";if(chartObj&&root)chartObj.applyOptions({width:root.clientWidth,height:h});return h;},
 getState:()=>({symbol:current,interval,candles:latestBars.length,lastClose:latestBars.length?latestBars[latestBars.length-1].close:null,quote:quotes[current]||null,chartSource:"Tickerbot OHLCV",quoteSource:quotes[current]?.provider||"unavailable",quoteTimestamp:quotes[current]?.stamp||null,atr14:stockAtr14()})
};
window.addEventListener("message",e=>{if(e.origin===location.origin&&e.data&&e.data.type==="rol-set-chart-symbol")chart(e.data.symbol,false);});
if(savedView.candleStyle&&["standard","heikin"].includes(savedView.candleStyle)){$("#candleStyle").value=savedView.candleStyle;candleStyle=savedView.candleStyle;}
if(savedView.indicator)$("#indicatorSelect").value=savedView.indicator;
if(typeof savedView.vwap==="boolean"&&$("#vwapToggle"))$("#vwapToggle").checked=savedView.vwap;
if(typeof savedView.hma==="boolean"&&$("#hmaToggle"))$("#hmaToggle").checked=savedView.hma;
if(savedView.ma&&typeof savedView.ma==="object")document.querySelectorAll(".ma-toggle").forEach(el=>{if(typeof savedView.ma[el.value]==="boolean")el.checked=savedView.ma[el.value];});
renderList();chart(current,false);renderOptionLadder();renderMovingAverages();renderIndicator();window.ROLyfeTradeContext=()=>({symbol:current,chart:window.ROLyfeChartDesk?.getState?.()||{},currentQuote:quotes[current]||null,stockLadder:$("#stockLadderOutput")?.innerText||"",stockOrderDraft:$("#stockOrderPreview")?.innerText||"",optionChoice:$("#rolTradeAiMode")?.value||"auto",selectedOption:selectedOptionContract||null,optionLadder:$("#optionBracketText")?.textContent||"",optionPremiumFields:{entry:$("#optEntry")?.value,stop:$("#optStop")?.value,contracts:$("#optQty")?.value,budget:$("#optBudget")?.value}});setInterval(()=>{loadBars();showQuote(findItem(current)).catch(()=>{});},60000);
})();