(() => {
  "use strict";

  const API = "https://ykmdyfbklvuoseqdjnxy.supabase.co/functions/v1/market-data";
  const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWR5ZmJrbHZ1b3NlcWRqbnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODk5OTQsImV4cCI6MjEwODM2NTk5NH0._YEZj2GSnPcLGXmwgj98V_JzXdJIhTmOFoAH9BSia2I";
  const $ = (selector) => document.querySelector(selector);
  const timeframes = [
    { key: "1d", label: "6M / 1D", interval: "1d", limit: 130, note: "Up to 130 daily bars" },
    { key: "4h", label: "4H", interval: "4h", limit: 300, note: "4-hour candles" },
    { key: "1h", label: "1H", interval: "1h", limit: 300, note: "1-hour candles" },
    { key: "15m", label: "15M", interval: "15m", limit: 300, note: "15-minute candles" },
    { key: "5m", label: "5M", interval: "5m", limit: 300, note: "5-minute candles" }
  ];
  const cache = new Map();
  let refreshSequence = 0;
  let lastLoadedSignature = "";

  const fmt = (n) => Number.isFinite(n)
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n < 1 ? 4 : 2 })
    : "—";

  function apiSymbol(symbol) {
    const value = String(symbol || "").trim().toUpperCase();
    const crypto = value.match(/^([A-Z0-9]+)-USD$/);
    return crypto ? "X:" + crypto[1] + "USD" : value;
  }

  async function getBars(symbol, config) {
    const key = symbol + "|" + config.interval;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.at < 45000) return cached.bars;
    const params = new URLSearchParams({
      provider: "tickerbot",
      symbol: apiSymbol(symbol),
      interval: config.interval,
      limit: String(config.limit)
    });
    const response = await fetch(API + "?" + params.toString(), {
      headers: { apikey: ANON, Authorization: "Bearer " + ANON, Accept: "application/json" },
      cache: "no-store"
    });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.bars)) {
      throw new Error(data.error || "No candle coverage returned");
    }
    const bars = data.bars.map((bar) => ({
      time: Math.floor(Number(bar.t) / 1000),
      open: Number(bar.o),
      high: Number(bar.h),
      low: Number(bar.l),
      close: Number(bar.c),
      volume: Number(bar.v) || 0
    })).filter((bar) => [bar.time, bar.open, bar.high, bar.low, bar.close].every(Number.isFinite))
      .sort((a, b) => a.time - b.time);
    if (bars.length < 50) throw new Error("Provider returned fewer than 50 usable candles");
    cache.set(key, { at: Date.now(), bars });
    return bars;
  }

  function ema(values, period) {
    const out = Array(values.length).fill(null);
    const valid = [];
    let previous = null;
    const factor = 2 / (period + 1);
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (!Number.isFinite(value)) continue;
      if (previous === null) {
        valid.push(value);
        if (valid.length === period) {
          previous = valid.reduce((sum, n) => sum + n, 0) / period;
          out[i] = previous;
        }
      } else {
        previous = value * factor + previous * (1 - factor);
        out[i] = previous;
      }
    }
    return out;
  }

  function wma(values, period) {
    const out = Array(values.length).fill(null);
    const divisor = period * (period + 1) / 2;
    for (let i = period - 1; i < values.length; i++) {
      let total = 0, valid = true;
      for (let j = 0; j < period; j++) {
        const value = values[i - period + 1 + j];
        if (!Number.isFinite(value)) { valid = false; break; }
        total += value * (j + 1);
      }
      if (valid) out[i] = total / divisor;
    }
    return out;
  }

  function hull(values, period = 32) {
    const half = Math.max(2, Math.floor(period / 2));
    const root = Math.max(2, Math.round(Math.sqrt(period)));
    const fast = wma(values, half);
    const slow = wma(values, period);
    const difference = values.map((_, i) =>
      Number.isFinite(fast[i]) && Number.isFinite(slow[i]) ? 2 * fast[i] - slow[i] : null
    );
    return wma(difference, root);
  }

  function rsi(values, period = 14) {
    if (values.length <= period) return NaN;
    let gains = 0, losses = 0;
    for (let i = 1; i <= period; i++) {
      const change = values[i] - values[i - 1];
      gains += Math.max(change, 0) / period;
      losses += Math.max(-change, 0) / period;
    }
    for (let i = period + 1; i < values.length; i++) {
      const change = values[i] - values[i - 1];
      gains = (gains * (period - 1) + Math.max(change, 0)) / period;
      losses = (losses * (period - 1) + Math.max(-change, 0)) / period;
    }
    if (losses === 0) return gains === 0 ? 50 : 100;
    return 100 - 100 / (1 + gains / losses);
  }

  function describeSignal(value) {
    if (value === "bullish") return "BULLISH";
    if (value === "bearish") return "BEARISH";
    return "MIXED";
  }

  function classify(bullish, bearish) {
    return bullish ? "bullish" : bearish ? "bearish" : "neutral";
  }

  function analyze(bars) {
    const closes = bars.map((bar) => bar.close);
    const highs = bars.map((bar) => bar.high);
    const lows = bars.map((bar) => bar.low);
    const last = closes[closes.length - 1];
    const ema20 = ema(closes, 20).at(-1);
    const ema50 = ema(closes, 50).at(-1);
    const rsiValue = rsi(closes, 14);
    const macdLine = ema(closes, 12).map((value, i) => {
      const slow = ema(closes, 26)[i];
      return Number.isFinite(value) && Number.isFinite(slow) ? value - slow : null;
    });
    const macdSignal = ema(macdLine, 9);
    const macdHistogram = macdLine.at(-1) - macdSignal.at(-1);

    const rawK = [];
    for (let i = 13; i < bars.length; i++) {
      const highest = Math.max(...highs.slice(i - 13, i + 1));
      const lowest = Math.min(...lows.slice(i - 13, i + 1));
      rawK.push(highest === lowest ? 50 : 100 * (closes[i] - lowest) / (highest - lowest));
    }
    const stochK = rawK.at(-1);
    const stochD = rawK.slice(-3).reduce((sum, value) => sum + value, 0) / Math.min(3, rawK.length);

    const hmaSeries = hull(closes, 32);
    const hmaNow = hmaSeries.at(-1);
    const hmaPrevious = hmaSeries.at(-2);
    const emaSignal = classify(last > ema20 && ema20 > ema50, last < ema20 && ema20 < ema50);
    const rsiSignal = classify(rsiValue >= 55, rsiValue <= 45);
    const macdSignalState = classify(macdHistogram > 0, macdHistogram < 0);
    const stochSignal = classify(stochK > stochD, stochK < stochD);
    const hmaSignal = classify(last > hmaNow && hmaNow > hmaPrevious, last < hmaNow && hmaNow < hmaPrevious);

    let score = 0;
    if (emaSignal === "bullish") score += 2;
    if (emaSignal === "bearish") score -= 2;
    if (rsiSignal === "bullish") score++;
    if (rsiSignal === "bearish") score--;
    if (macdSignalState === "bullish") score++;
    if (macdSignalState === "bearish") score--;
    if (stochSignal === "bullish") score++;
    if (stochSignal === "bearish") score--;
    if (hmaSignal === "bullish") score++;
    if (hmaSignal === "bearish") score--;

    const bullish = score >= 3 && emaSignal === "bullish";
    const bearish = score <= -3 && emaSignal === "bearish";
    return {
      bars, closes, last, ema20, ema50, rsi: rsiValue, macdHistogram, stochK, stochD,
      hmaSeries, hmaNow, hmaPrevious, emaSignal, rsiSignal, macdSignal: macdSignalState,
      stochSignal, hmaSignal, score, posture: bullish ? "bullish" : bearish ? "bearish" : "neutral"
    };
  }

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function injectPanel() {
    const panel = $("#technicalPosturePanel");
    const metrics = $("#technicalPostureMetrics");
    if (!panel || !metrics || $("#rolPostureEnhancements")) return;
    const extra = create("section", "rol-posture-enhancements");
    extra.id = "rolPostureEnhancements";
    extra.setAttribute("aria-label", "Multi-timeframe technical confluence");
    extra.append(create("h3", "rol-posture-subtitle", "INDICATOR CONFLUENCE"));
    const hmaRow = create("div", "rol-hma-row");
    hmaRow.id = "rolHmaRow";
    hmaRow.append(create("div", "rol-hma-copy", "Hull Moving Average · HMA 32"));
    const spark = create("svg", "rol-hma-spark");
    spark.setAttribute("viewBox", "0 0 240 48");
    spark.setAttribute("role", "img");
    spark.setAttribute("aria-label", "Hull moving average direction visual");
    spark.id = "rolHmaSpark";
    hmaRow.append(spark);
    extra.append(hmaRow);

    const mtf = create("div", "rol-mtf-wrap");
    mtf.append(create("h3", "rol-posture-subtitle", "MULTI-TIMEFRAME ALIGNMENT"));
    const grid = create("div", "rol-mtf-grid");
    grid.id = "rolMtfGrid";
    timeframes.forEach((config) => {
      const card = create("article", "rol-mtf-card");
      card.dataset.timeframe = config.key;
      card.append(create("strong", "rol-mtf-label", config.label));
      card.append(create("span", "rol-mtf-state", "Loading…"));
      card.append(create("small", "rol-mtf-detail", config.note));
      grid.append(card);
    });
    mtf.append(grid);
    mtf.append(create("p", "rol-mtf-note", "6M / 1D uses up to 130 daily candles (approximately six months of trading sessions). Each timeframe is calculated independently from returned OHLCV. Missing provider coverage is shown as unavailable—not guessed."));
    extra.append(mtf);

    const iv = create("div", "rol-iv-readout", "Implied Volatility · No live option IV loaded");
    iv.id = "rolIvReadout";
    iv.title = "Uses the selected option-chain contract's returned IV only; this is absolute IV, not IV rank or percentile.";
    extra.append(iv);

    const note = $("#technicalPosturePanel .technical-posture-note");
    panel.insertBefore(extra, note || null);
  }

  function setSignal(element, label, signal) {
    if (!element) return;
    element.classList.remove("posture-bullish", "posture-bearish", "posture-neutral");
    element.classList.add("posture-" + signal);
    element.title = label + " directional reading from the selected candles.";
  }

  function renderSparkline(result) {
    const svg = $("#rolHmaSpark");
    const row = $("#rolHmaRow");
    if (!svg || !row) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const values = result.hmaSeries.filter(Number.isFinite).slice(-50);
    if (values.length < 2) return;
    const minimum = Math.min(...values), maximum = Math.max(...values);
    const spread = maximum - minimum || 1;
    const points = values.map((value, index) => {
      const x = 3 + index * 234 / (values.length - 1);
      const y = 43 - (value - minimum) / spread * 36;
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", points);
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", result.hmaSignal === "bullish" ? "#50e0a2" : result.hmaSignal === "bearish" ? "#ff7186" : "#f0c36b");
    line.setAttribute("stroke-width", "2.8");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    svg.append(line);
    const value = fmt(result.hmaNow);
    row.querySelector(".rol-hma-copy").textContent = "Hull Moving Average · HMA 32 · " + value + " · " + describeSignal(result.hmaSignal);
    row.dataset.signal = result.hmaSignal;
    setSignal(row, "HMA 32 " + describeSignal(result.hmaSignal), result.hmaSignal);
  }

  function renderCurrent(result) {
    const metrics = $("#technicalPostureMetrics");
    if (!metrics) return;
    const spans = Array.from(metrics.querySelectorAll("span"));
    const readings = [
      { text: "EMA 20 / 50 · " + fmt(result.ema20) + " / " + fmt(result.ema50) + " · " + describeSignal(result.emaSignal), signal: result.emaSignal },
      { text: "RSI 14 · " + result.rsi.toFixed(1) + " · " + describeSignal(result.rsiSignal), signal: result.rsiSignal },
      { text: "MACD hist · " + (result.macdHistogram > 0 ? "+" : "") + result.macdHistogram.toFixed(4) + " · " + describeSignal(result.macdSignal), signal: result.macdSignal },
      { text: "Stoch K / D · " + result.stochK.toFixed(1) + " / " + result.stochD.toFixed(1) + " · " + describeSignal(result.stochSignal), signal: result.stochSignal }
    ];
    readings.forEach((reading, index) => {
      const span = spans[index];
      if (span) {
        span.textContent = reading.text;
        setSignal(span, reading.text, reading.signal);
      }
    });
    renderSparkline(result);
    renderIvReadout();
  }

  function renderMtf(results, activeInterval) {
    const grid = $("#rolMtfGrid");
    if (!grid) return;
    results.forEach(({ config, result, error }) => {
      const card = grid.querySelector('[data-timeframe="' + config.key + '"]');
      if (!card) return;
      card.classList.toggle("active", config.interval === activeInterval);
      const state = card.querySelector(".rol-mtf-state");
      const detail = card.querySelector(".rol-mtf-detail");
      card.classList.remove("is-bullish", "is-bearish", "is-neutral", "is-unavailable");
      if (error || !result) {
        card.classList.add("is-unavailable");
        state.textContent = "UNAVAILABLE";
        detail.textContent = error || "No verified candle data";
        return;
      }
      card.classList.add("is-" + result.posture);
      state.textContent = result.posture === "bullish" ? "↑ BULLISH" : result.posture === "bearish" ? "↓ BEARISH" : "⏸ MIXED";
      detail.textContent = "Score " + (result.score > 0 ? "+" : "") + result.score
        + " · RSI " + result.rsi.toFixed(0)
        + " · HMA " + describeSignal(result.hmaSignal);
    });
  }

  function renderIvReadout() {
    const output = $("#rolIvReadout");
    const details = $("#optionQuoteDetails");
    if (!output) return;
    const text = details ? details.textContent : "";
    const match = text.match(/\bIV:\s*([0-9]+(?:\.[0-9]+)?)%/i);
    if (!match) {
      output.textContent = "Implied Volatility · Unavailable (no returned contract IV)";
      output.dataset.signal = "neutral";
      return;
    }
    const value = Number(match[1]);
    const band = value <= 20 ? "LOW IV · ≤20%" : value >= 80 ? "HIGH IV · ≥80%" : "MID-RANGE IV · 20–80%";
    output.textContent = "Implied Volatility · " + value.toFixed(1) + "% · " + band;
    output.dataset.signal = value <= 20 ? "low" : value >= 80 ? "high" : "mid";
  }

  async function refreshForCurrentChart() {
    const state = window.ROLyfeChartDesk?.getState?.();
    if (!state || !state.symbol) return;
    const signature = state.symbol + "|" + state.interval + "|" + state.candles;
    if (signature === lastLoadedSignature) return;
    lastLoadedSignature = signature;
    const sequence = ++refreshSequence;
    const tasks = timeframes.map(async (config) => {
      try {
        const bars = await getBars(state.symbol, config);
        return { config, result: analyze(bars), error: "" };
      } catch (error) {
        return { config, result: null, error: error instanceof Error ? error.message : "Provider request failed" };
      }
    });
    const results = await Promise.all(tasks);
    if (sequence !== refreshSequence) return;
    renderMtf(results, state.interval);
    const selected = results.find((item) => item.config.interval === state.interval);
    if (selected && selected.result) renderCurrent(selected.result);
    else renderIvReadout();
  }

  function watchChart() {
    const status = $("#chartStatus");
    if (!status) return;
    const observer = new MutationObserver(() => {
      if (status.textContent.trim() === "CANDLES LOADED") refreshForCurrentChart();
      else if (status.textContent.trim() === "LOADING CANDLES") {
        lastLoadedSignature = "";
        $("#rolMtfGrid")?.querySelectorAll(".rol-mtf-state").forEach((node) => { node.textContent = "Loading…"; });
      }
    });
    observer.observe(status, { childList: true, characterData: true, subtree: true });
    if (status.textContent.trim() === "CANDLES LOADED") refreshForCurrentChart();
  }

  function watchOptionDetails() {
    const details = $("#optionQuoteDetails");
    if (!details) return;
    const observer = new MutationObserver(renderIvReadout);
    observer.observe(details, { childList: true, characterData: true, subtree: true });
    document.querySelectorAll("#optionContractSelect, #loadOptionChain, #optType").forEach((element) => {
      element.addEventListener("change", renderIvReadout);
      element.addEventListener("click", renderIvReadout);
    });
    renderIvReadout();
  }

  injectPanel();
  watchChart();
  watchOptionDetails();
  window.addEventListener("rol-live-chart-quote", renderIvReadout);
})();
