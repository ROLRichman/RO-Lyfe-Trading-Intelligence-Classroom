import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type, accept, x-supabase-api-version, x-requested-with, cache-control",
  "Access-Control-Max-Age": "86400",
};
const jsonHeaders = {
  ...corsHeaders,
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};
const marketDataCache = new Map<string, { savedAt: number; ttlMs: number; payload: Record<string, unknown> }>();

function json(body: unknown, status = 200, cacheSeconds = 0) {
  const headers = {
    ...jsonHeaders,
    "Cache-Control": cacheSeconds > 0
      ? `public, max-age=0, s-maxage=${cacheSeconds}, stale-while-revalidate=15`
      : "no-store",
  };
  return new Response(JSON.stringify(body), { status, headers });
}

async function alphaVantageDailyFallback(
  symbol: string,
  interval: string,
  limit: number,
  from: string | null,
  to: string | null,
): Promise<{ payload?: Record<string, unknown>; error?: string }> {
  if (!["1d", "1w", "1mo"].includes(interval)) {
    return { error: "No verified free intraday fallback is configured for this interval." };
  }
  const apiKey = Deno.env.get("ALPHA_VANTAGE_API_KEY");
  if (!apiKey) return { error: "Alpha Vantage fallback is not configured in Edge Function Secrets." };

  const functionName = interval === "1d" ? "TIME_SERIES_DAILY" : interval === "1w" ? "TIME_SERIES_WEEKLY" : "TIME_SERIES_MONTHLY";
  const seriesKey = interval === "1d" ? "Time Series (Daily)" : interval === "1w" ? "Weekly Time Series" : "Monthly Time Series";
  const endpoint = new URL("https://www.alphavantage.co/query");
  endpoint.searchParams.set("function", functionName);
  endpoint.searchParams.set("symbol", symbol);
  endpoint.searchParams.set("apikey", apiKey);
  if (interval === "1d") endpoint.searchParams.set("outputsize", "compact");

  try {
    const response = await fetch(endpoint, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return { error: "Alpha Vantage fallback request failed (HTTP " + response.status + ")." };
    const data = await response.json();
    if (data.Note || data.Information || data["Error Message"]) {
      return { error: "Alpha Vantage fallback is rate-limited or this endpoint is not included in its plan." };
    }
    const series = data[seriesKey] as Record<string, Record<string, string>> | undefined;
    if (!series || typeof series !== "object") {
      return { error: "Alpha Vantage did not return the requested daily, weekly, or monthly series." };
    }
    const entries = Object.entries(series)
      .filter(([date]) => (!from || date >= from) && (!to || date <= to))
      .slice(0, Math.min(1000, limit));
    const bars = entries.map(([date, row]) => ({
      t: date,
      o: Number(row["1. open"]),
      h: Number(row["2. high"]),
      l: Number(row["3. low"]),
      c: Number(row["4. close"]),
      v: Number(row["5. volume"]),
    })).filter((bar) => [bar.o, bar.h, bar.l, bar.c].every((n) => Number.isFinite(n) && n > 0));
    if (bars.length < 30) return { error: "Alpha Vantage fallback returned fewer than 30 valid candles; replay requires at least 30." };
    return {
      payload: {
        provider: "alphavantage",
        symbol,
        interval,
        asOf: entries[0]?.[0] || null,
        count: bars.length,
        coverage: interval === "1d" ? "fallback_daily_compact" : "fallback_" + interval,
        adjusted: false,
        session: "regular",
        bars,
        nextCursor: null,
        dataStatus: "provider_fallback",
        note: "Fallback daily, weekly, or monthly OHLCV from Alpha Vantage. No free intraday fallback is assumed; check provider entitlement and timestamps.",
      },
    };
  } catch {
    return { error: "Alpha Vantage fallback could not be reached." };
  }
}

function queryParam(url: URL, name: string): string | null {
  const target = name.trim().toLowerCase();
  for (const [key, value] of url.searchParams.entries()) {
    if (key.trim().toLowerCase() === target) return value.trim();
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }
  if (req.method !== "GET") {
    return json({ error: "Method not allowed. Use GET." }, 405);
  }

  const url = new URL(req.url);
  const provider = (queryParam(url, "provider") || "finnhub").toLowerCase();
  const symbol = (queryParam(url, "symbol") || "").trim().toUpperCase();

  try {

    if (provider === "alphavantage-fundamentals") {
      if (!/^[A-Z0-9.^_-]{1,20}$/.test(symbol)) return json({ error: "Provide a valid stock or ETF ticker." }, 400);
      const apiKey = Deno.env.get("ALPHA_VANTAGE_API_KEY");
      if (!apiKey) return json({ error: "Alpha Vantage is not configured in this Supabase project's Edge Function Secrets." }, 503);
      const endpoint = (fn: string) => {
        const target = new URL("https://www.alphavantage.co/query");
        target.searchParams.set("function", fn);
        target.searchParams.set("symbol", symbol);
        target.searchParams.set("apikey", apiKey);
        return target;
      };
      try {
        const [cashResponse, overviewResponse] = await Promise.all([
          fetch(endpoint("CASH_FLOW"), { headers: { "Accept": "application/json" }, signal: AbortSignal.timeout(15000) }),
          fetch(endpoint("OVERVIEW"), { headers: { "Accept": "application/json" }, signal: AbortSignal.timeout(15000) })
        ]);
        const [cashData, overviewData] = await Promise.all([
          cashResponse.ok ? cashResponse.json() : Promise.resolve({}),
          overviewResponse.ok ? overviewResponse.json() : Promise.resolve({})
        ]);
        const providerNotice = [cashData.Note, cashData.Information, cashData["Error Message"], overviewData.Note, overviewData.Information, overviewData["Error Message"]].filter(Boolean).map(String).join(" ");
        const cashAvailable = (Array.isArray(cashData.annualReports) && cashData.annualReports.length > 0) || (Array.isArray(cashData.quarterlyReports) && cashData.quarterlyReports.length > 0);
        const companyAvailable = typeof overviewData.Description === "string" && overviewData.Description.length > 0;
        if (!cashAvailable && !companyAvailable) {
          return json({ error: providerNotice ? "Alpha Vantage did not return fundamentals: " + providerNotice.slice(0, 260) : "Fundamental data is unavailable for this symbol or not included in the current Alpha Vantage plan.", provider: "alphavantage", symbol, dataStatus: "unavailable" }, 503);
        }
        const company = companyAvailable ? {
          name: overviewData.Name || symbol, description: overviewData.Description || null,
          exchange: overviewData.Exchange || null, sector: overviewData.Sector || null,
          industry: overviewData.Industry || null, marketCapitalization: overviewData.MarketCapitalization || null,
          peRatio: overviewData.PERatio || null, eps: overviewData.EPS || null,
          revenueTtm: overviewData.RevenueTTM || null, profitMargin: overviewData.ProfitMargin || null,
          fiftyTwoWeekHigh: overviewData["52WeekHigh"] || null, fiftyTwoWeekLow: overviewData["52WeekLow"] || null
        } : null;
        return json({
          provider: "alphavantage", symbol, company,
          annualReports: Array.isArray(cashData.annualReports) ? cashData.annualReports.slice(0, 8) : [],
          quarterlyReports: Array.isArray(cashData.quarterlyReports) ? cashData.quarterlyReports.slice(0, 12) : [],
          companyAvailable, cashFlowAvailable: cashAvailable,
          dataStatus: "provider_response", retrievedAt: new Date().toISOString(),
          note: "Company overview and cash-flow statements from Alpha Vantage. Financial reporting periods and plan entitlements vary. Free cash flow is calculated as operating cash flow less the absolute value of reported capital expenditures."
        });
      } catch {
        return json({ error: "Alpha Vantage fundamentals could not be reached.", provider: "alphavantage", symbol }, 502);
      }
    }

    if (provider === "massive-stock-snapshot") {
      if (!/^[A-Z0-9.\-]{1,15}$/.test(symbol)) return json({ error: "Provide a valid U.S. stock or ETF ticker." }, 400);
      const apiKey = Deno.env.get("ROLYFE_RTIC_MARKET_INTELLIGENCE");
      if (!apiKey) return json({ error: "Massive key is not configured in this Supabase project's Edge Function Secrets. Add ROLYFE_RTIC_MARKET_INTELLIGENCE there; a GitHub secret is not visible to Supabase." }, 503);
      const endpoint = new URL("https://api.massive.com/v2/snapshot/locale/us/markets/stocks/tickers/" + encodeURIComponent(symbol));
      const response = await fetch(endpoint, { headers: { "Accept": "application/json", "Authorization": "Bearer " + apiKey }, signal: AbortSignal.timeout(12000) });
      if (!response.ok) return json({ error: response.status === 401 ? "Massive rejected the configured API key." : response.status === 403 ? "Massive account or plan does not include this stock snapshot." : response.status === 429 ? "Massive request limit reached." : "Massive stock snapshot request failed.", provider: "massive", providerStatus: response.status }, response.status === 429 ? 429 : 502);
      const payload = await response.json();
      const snap = payload.ticker || payload.results?.[0] || {};
      const trade = snap.lastTrade || snap.last_trade || {};
      const quote = snap.lastQuote || snap.last_quote || {};
      const day = snap.day || {};
      const minute = snap.min || {};
      const price = Number(trade.p ?? trade.price ?? day.c ?? minute.c ?? snap.prevDay?.c);
      if (!Number.isFinite(price) || price <= 0) return json({ error: "Massive returned a snapshot without a usable latest price. Check plan access and ticker coverage.", provider: "massive", symbol, requestId: payload.request_id || null }, 422);
      return json({
        provider: "massive", symbol, price,
        change: Number.isFinite(Number(snap.todaysChange)) ? Number(snap.todaysChange) : null,
        changePercent: Number.isFinite(Number(snap.todaysChangePerc)) ? Number(snap.todaysChangePerc) : null,
        bid: Number.isFinite(Number(quote.bid ?? quote.p)) ? Number(quote.bid ?? quote.p) : null,
        ask: Number.isFinite(Number(quote.ask ?? quote.P)) ? Number(quote.ask ?? quote.P) : null,
        bidSize: quote.bid_size ?? quote.bs ?? null, askSize: quote.ask_size ?? quote.as ?? null,
        timestamp: trade.sip_timestamp ?? trade.t ?? quote.sip_timestamp ?? quote.t ?? snap.updated ?? null,
        requestId: payload.request_id || null, dataStatus: "provider_response",
        note: "Massive stock snapshot. Timestamp and plan entitlements determine recency; verify before planning an order."
      });
    }

    if (provider === "massive-options-reference") {
      if (!/^[A-Z0-9.\\-]{1,15}$/.test(symbol)) return json({ error: "Provide a valid stock or ETF underlying ticker." }, 400);
      const contractType = (queryParam(url, "contract_type") || "call").toLowerCase();
      if (contractType !== "call" && contractType !== "put") return json({ error: "contract_type must be call or put." }, 400);
      const expiration = queryParam(url, "expiration_date");
      if (expiration && !/^\\d{4}-\\d{2}-\\d{2}$/.test(expiration)) return json({ error: "expiration_date must use YYYY-MM-DD." }, 400);
      const limitRaw = Number(queryParam(url, "limit") || "250");
      const limit = Number.isInteger(limitRaw) ? Math.min(1000, Math.max(1, limitRaw)) : 250;
      const apiKey = Deno.env.get("ROLYFE_RTIC_MARKET_INTELLIGENCE");
      if (!apiKey) return json({ error: "Massive key is not configured in this Supabase project's Edge Function Secrets. Add ROLYFE_RTIC_MARKET_INTELLIGENCE there; a GitHub secret is not visible to Supabase." }, 503);
      const endpoint = new URL("https://api.massive.com/v3/reference/options/contracts");
      endpoint.searchParams.set("underlying_ticker", symbol);
      endpoint.searchParams.set("contract_type", contractType);
      endpoint.searchParams.set("expired", "false");
      endpoint.searchParams.set("limit", String(limit));
      endpoint.searchParams.set("order", "asc");
      endpoint.searchParams.set("sort", "strike_price");
      if (expiration) endpoint.searchParams.set("expiration_date", expiration);
      const response = await fetch(endpoint, {
        headers: { "Accept": "application/json", "Authorization": "Bearer " + apiKey },
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) return json({
        error: response.status === 401 ? "Massive rejected the configured API key." :
          response.status === 403 ? "Massive contract-reference access is not enabled for this API key." :
          response.status === 429 ? "Massive contract-reference request limit reached." :
          "Massive listed-contract reference request failed.",
        provider: "massive", providerStatus: response.status
      }, response.status === 429 ? 429 : 502);
      const payload = await response.json();
      const contracts = Array.isArray(payload.results) ? payload.results.map((row: Record<string, any>) => ({
        ticker: row.ticker || null,
        contractType: row.contract_type || contractType,
        expirationDate: row.expiration_date || null,
        strike: Number(row.strike_price),
        sharesPerContract: Number.isFinite(Number(row.shares_per_contract)) ? Number(row.shares_per_contract) : null,
        bid: null, ask: null, last: null, openInterest: null, volume: null,
        impliedVolatility: null, quoteTimestamp: null, tradeTimestamp: null,
        referenceOnly: true,
      })).filter((row: any) => Number.isFinite(row.strike) && row.strike > 0) : [];
      return json({
        provider: "massive", symbol, contractType, expirationDate: expiration || null,
        count: contracts.length, contracts, nextUrl: payload.next_url || null,
        requestId: payload.request_id || null, dataStatus: "contract_reference_only",
        note: "Listed contract definitions only. This endpoint does not provide live bid/ask, midpoint, last trade, implied volatility, Greeks, or executable premiums. Load the Option Chain Snapshot endpoint for current quote data."
      });
    }

    if (provider === "massive-options-chain") {
      if (!/^[A-Z0-9.\-]{1,15}$/.test(symbol)) return json({ error: "Provide a valid stock or ETF underlying ticker." }, 400);
      const contractType = (queryParam(url, "contract_type") || "call").toLowerCase();
      if (contractType !== "call" && contractType !== "put") return json({ error: "contract_type must be call or put." }, 400);
      const expiration = queryParam(url, "expiration_date");
      if (expiration && !/^\d{4}-\d{2}-\d{2}$/.test(expiration)) return json({ error: "expiration_date must use YYYY-MM-DD." }, 400);
      const limitRaw = Number(queryParam(url, "limit") || "250");
      const limit = Number.isInteger(limitRaw) ? Math.min(250, Math.max(1, limitRaw)) : 250;
      const apiKey = Deno.env.get("ROLYFE_RTIC_MARKET_INTELLIGENCE");
      if (!apiKey) return json({ error: "Massive key is not configured in this Supabase project's Edge Function Secrets. Add ROLYFE_RTIC_MARKET_INTELLIGENCE there; a GitHub secret is not visible to Supabase." }, 503);
      const endpoint = new URL("https://api.massive.com/v3/snapshot/options/" + encodeURIComponent(symbol));
      endpoint.searchParams.set("contract_type", contractType);
      endpoint.searchParams.set("limit", String(limit));
      endpoint.searchParams.set("order", "asc");
      endpoint.searchParams.set("sort", "strike_price");
      if (expiration) endpoint.searchParams.set("expiration_date", expiration);
      const response = await fetch(endpoint, { headers: { "Accept": "application/json", "Authorization": "Bearer " + apiKey }, signal: AbortSignal.timeout(15000) });
      if (!response.ok) return json({ error: response.status === 401 ? "Massive rejected the configured API key." : response.status === 403 ? "Massive Options Chain Snapshot is not included in the current options plan. Contract reference access alone does not provide live premiums." : response.status === 429 ? "Massive options request limit reached." : "Massive options-chain request failed.", provider: "massive", providerStatus: response.status }, response.status === 429 ? 429 : 502);
      const payload = await response.json();
      const contracts = Array.isArray(payload.results) ? payload.results.map((row: Record<string, any>) => {
        const details = row.details || {};
        const quote = row.last_quote || row.lastQuote || {};
        const trade = row.last_trade || row.lastTrade || {};
        const underlying = row.underlying_asset || row.underlyingAsset || {};
        const bid = Number(quote.bid ?? quote.p);
        const ask = Number(quote.ask ?? quote.P);
        const last = Number(trade.price ?? trade.p);
        return {
          ticker: details.ticker || row.ticker || null, contractType: details.contract_type || contractType,
          expirationDate: details.expiration_date || null, strike: Number(details.strike_price ?? row.strike_price),
          sharesPerContract: details.shares_per_contract ?? null,
          bid: Number.isFinite(bid) && bid > 0 ? bid : null, ask: Number.isFinite(ask) && ask > 0 ? ask : null,
          last: Number.isFinite(last) && last > 0 ? last : null,
          bidSize: quote.bid_size ?? quote.bs ?? null, askSize: quote.ask_size ?? quote.as ?? null,
          openInterest: Number.isFinite(Number(row.open_interest)) ? Number(row.open_interest) : null,
          volume: Number.isFinite(Number(row.day?.volume ?? row.day?.v)) ? Number(row.day?.volume ?? row.day?.v) : null,
          impliedVolatility: Number.isFinite(Number(row.implied_volatility)) ? Number(row.implied_volatility) : null,
          greeks: row.greeks || null, underlyingPrice: Number.isFinite(Number(underlying.price)) ? Number(underlying.price) : null,
          quoteTimestamp: quote.sip_timestamp ?? quote.t ?? null, tradeTimestamp: trade.sip_timestamp ?? trade.t ?? null
        };
      }).filter((x: any) => Number.isFinite(x.strike) && x.strike > 0) : [];
      return json({ provider: "massive", symbol, contractType, expirationDate: expiration || null, count: contracts.length, contracts, nextUrl: payload.next_url || null, requestId: payload.request_id || null, dataStatus: "provider_response", note: "Option contract pricing and timestamps are subject to the Massive subscription entitlement. Bid/ask, IV, Greeks and open interest may be absent when not covered." });
    }

    if (provider === "massive-insider-activity") {
      if (!/^[A-Z0-9.\-]{1,15}$/.test(symbol)) return json({ error: "Provide a valid stock ticker." }, 400);
      const apiKey = Deno.env.get("ROLYFE_RTIC_MARKET_INTELLIGENCE");
      if (!apiKey) return json({ error: "Massive key is not configured in Supabase Edge Function Secrets." }, 503);
      const endpoint = new URL("https://api.massive.com/stocks/insiders/vX/activity");
      endpoint.searchParams.set("tickers", symbol);
      endpoint.searchParams.set("limit", "20");
      endpoint.searchParams.set("sort", "transaction_date.desc");
      const response = await fetch(endpoint, { headers: { "Accept": "application/json", "Authorization": "Bearer " + apiKey }, signal: AbortSignal.timeout(12000) });
      if (!response.ok) return json({ error: "Massive insider activity request failed.", provider: "massive", providerStatus: response.status }, 502);
      const payload = await response.json();
      return json({ provider: "massive", symbol, results: Array.isArray(payload.results) ? payload.results : [], requestId: payload.request_id || null, dataStatus: "provider_response", note: "SEC Form 4/5 aggregated insider activity; provider updates daily during the early-access beta." });
    }

    if (provider === "tickerbot-row") {
      const symbols = symbol.split(",").map((x) => x.trim()).filter(Boolean);
      if (!symbols.length || symbols.length > 50 || symbols.some((x) => !/^(X:)?[A-Z0-9.^_-]{1,20}$/.test(x))) {
        return json({ error: "Use 1 to 50 valid Tickerbot symbols, e.g. AAPL or X:BTCUSD." }, 400);
      }
      const apiKey = Deno.env.get("TICKERBOT_API_KEY");
      if (!apiKey) return json({ error: "Tickerbot is not configured in Edge Function Secrets." }, 503);
      const path = symbols.map((x) => encodeURIComponent(x)).join(",");
      const endpoint = new URL("https://api.tickerbot.io/v2/tickers/" + path);
      const response = await fetch(endpoint, {
        headers: { "Accept": "application/json", "Authorization": "Bearer " + apiKey },
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) return json({
        error: response.status === 401 ? "Tickerbot rejected the configured API key." :
          response.status === 403 ? "Tickerbot account does not have access to ticker rows." :
          response.status === 429 ? "Tickerbot request limit reached." : "Tickerbot ticker-row request failed.",
        provider: "tickerbot", providerStatus: response.status
      }, response.status === 429 ? 429 : 502);
      const data = await response.json();
      const allowed = [
        "ticker","name","asset_class","asset_type","exchange","country","price","change_1d_pct","gap_pct",
        "relative_volume","volume_today","avg_volume_10d","market_cap","high_52w","low_52w",
        "rsi_14","rsi_7","stochastic_k","stochastic_d","macd_line","macd_signal","macd_histogram",
        "adx_14","plus_di","minus_di","atr_14","atr_pct","bollinger_b","bollinger_width",
        "ema_9","ema_12","ema_21","ema_26","sma_10","sma_20","sma_50","sma_200",
        "vwap","day_vwap","above_vwap","above_sma_50","above_sma_200","golden_cross","trend_short","trend_medium","trend_long"
      ];
      const clean = (row: Record<string, unknown>) => {
        const out: Record<string, unknown> = {};
        for (const key of allowed) if (row && Object.prototype.hasOwnProperty.call(row, key)) out[key] = row[key];
        return out;
      };
      let rows: Record<string, unknown> | Record<string, unknown>[] = {};
      if (data?.data && typeof data.data === "object" && !Array.isArray(data.data)) {
        rows = symbols.length === 1 ? clean(data.data) : Object.fromEntries(
          Object.entries(data.data).map(([key, value]) => [key, clean(value as Record<string, unknown>)])
        );
      } else if (data?.ticker) {
        rows = clean(data);
      }
      return json({
        provider: "tickerbot", asOf: data.as_of || null, ticker: data.ticker || null,
        requested: symbols, count: data.count ?? (Array.isArray(rows) ? rows.length : Object.keys(rows).length),
        data: rows, notFound: data.not_found || [],
        note: "Tickerbot ticker-row values refresh on the provider's published cadence; fields may be null when not covered."
      });
    }

    if (provider === "tickerbot-scan") {
      const assetClass = (queryParam(url, "asset_class") || "stocks").toLowerCase();
      if (assetClass !== "stocks" && assetClass !== "crypto") {
        return json({ error: "Tickerbot scan supports stocks or crypto here. Futures are not connected to this feed." }, 400);
      }
      const symbols = (queryParam(url, "symbols") || "").split(",").map((x) => x.trim().toUpperCase()).filter(Boolean);
      if (!symbols.length || symbols.length > 100 || symbols.some((x) => !/^(X:)?[A-Z0-9.^_-]{1,20}$/.test(x))) {
        return json({ error: "Provide 1 to 100 valid symbols for the selected asset class." }, 400);
      }
      if (assetClass === "stocks" && symbols.some((x) => x.startsWith("X:"))) {
        return json({ error: "Use plain stock/ETF tickers for the stocks group." }, 400);
      }
      if (assetClass === "crypto" && symbols.some((x) => !x.startsWith("X:"))) {
        return json({ error: "Use Tickerbot crypto symbols such as X:BTCUSD." }, 400);
      }
      const apiKey = Deno.env.get("TICKERBOT_API_KEY");
      if (!apiKey) return json({ error: "Tickerbot is not configured in Edge Function Secrets." }, 503);
      const q = "ticker IN (" + symbols.map((x) => "'" + x + "'").join(",") + ")";
      const limitRaw = Number(queryParam(url, "limit") || String(symbols.length));
      const limit = Number.isInteger(limitRaw) ? Math.min(100, Math.max(1, limitRaw)) : symbols.length;
      const body = {
        q, asset_class: [assetClass],
        columns: [
          "rsi_14","stochastic_k","stochastic_d","macd_line","macd_signal","macd_histogram",
          "adx_14","plus_di","minus_di","atr_14","atr_pct","bollinger_b","bollinger_width",
          "ema_9","ema_12","ema_21","ema_26","sma_20","sma_50","sma_200",
          "vwap","day_vwap","above_vwap","above_sma_50","above_sma_200"
        ],
        order: "relative_volume", dir: "desc", limit
      };
      const response = await fetch("https://api.tickerbot.io/v2/scan", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) return json({
        error: response.status === 401 ? "Tickerbot rejected the configured API key." :
          response.status === 403 ? "Tickerbot scan access is not enabled for this account." :
          response.status === 429 ? "Tickerbot scan rate limit reached." : "Tickerbot live scan failed.",
        provider: "tickerbot", providerStatus: response.status
      }, response.status === 429 ? 429 : 502);
      const data = await response.json();
      const allowed = [
        "ticker","name","asset_class","asset_type","price","change_1d_pct","gap_pct","relative_volume",
        "market_cap","volume_today","rsi_14","stochastic_k","stochastic_d","macd_line","macd_signal",
        "macd_histogram","adx_14","plus_di","minus_di","atr_14","atr_pct","bollinger_b","bollinger_width",
        "ema_9","ema_12","ema_21","ema_26","sma_20","sma_50","sma_200","vwap","day_vwap",
        "above_vwap","above_sma_50","above_sma_200"
      ];
      const results = Array.isArray(data.results) ? data.results.map((row: Record<string, unknown>) => {
        const out: Record<string, unknown> = {};
        for (const key of allowed) if (Object.prototype.hasOwnProperty.call(row, key)) out[key] = row[key];
        return out;
      }) : [];
      return json({
        provider: "tickerbot", assetClass, asOf: data.as_of || null, count: data.count ?? results.length,
        results, notFound: data.not_found || [], meta: data._meta || null, query: data.query || body,
        note: "Live scanner results from Tickerbot's current ticker universe. Indicator cadence and null coverage vary by signal."
      });
    }

    if (provider === "tickerbot") {
      if (!/^(X:)?[A-Z0-9.^_-]{1,20}$/.test(symbol)) {
        return json({ error: "Provide a valid ticker, for example AAPL or X:BTCUSD." }, 400);
      }

      const interval = (queryParam(url, "interval") || "1d").toLowerCase();
      const allowedIntervals = new Set(["1s", "1m", "5m", "15m", "30m", "1h", "2h", "4h", "1d", "1w", "1mo"]);
      if (!allowedIntervals.has(interval)) {
        return json({ error: "Unsupported interval. Choose 1m, 5m, 15m, 30m, 1h, 2h, 4h, 1d, 1w, or 1mo." }, 400);
      }

      const requestedLimit = Number(queryParam(url, "limit") || "100");
      if (!Number.isInteger(requestedLimit) || requestedLimit < 1) {
        return json({ error: "Limit must be a positive whole number." }, 400);
      }
      // Tickerbot permits up to 1,000 bars per page; clients can follow nextCursor.
      const limit = Math.min(requestedLimit, 1000);
      const cursor = queryParam(url, "cursor");
      const from = queryParam(url, "from");
      const to = queryParam(url, "to");
      const session = (queryParam(url, "session") || "all").toLowerCase();
      const subHour = ["1s", "1m", "5m", "15m", "30m"].includes(interval);
      if (session !== "all" && session !== "regular") {
        return json({ error: "Session must be all or regular." }, 400);
      }
      if ((from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) ||
          (to && !/^\d{4}-\d{2}-\d{2}$/.test(to))) {
        return json({ error: "from and to must use YYYY-MM-DD dates." }, 400);
      }
      if (from && to && from > to) {
        return json({ error: "from must be on or before to." }, 400);
      }
      if (cursor && cursor.length > 2048) {
        return json({ error: "Invalid cursor." }, 400);
      }
      const cacheable = !cursor && !from && !to;
      const ttlSeconds = subHour ? 20 : interval === "1h" || interval === "2h" || interval === "4h" ? 60 : 180;
      const cacheKey = [symbol, interval, session, limit].join("|");
      const cached = cacheable ? marketDataCache.get(cacheKey) : undefined;
      if (cached && Date.now() - cached.savedAt <= cached.ttlMs) {
        return json({ ...cached.payload, cache: "edge-memory", cacheAgeMs: Date.now() - cached.savedAt }, 200, ttlSeconds);
      }

      const apiKey = Deno.env.get("TICKERBOT_API_KEY");
      if (!apiKey) {
        const fallback = await alphaVantageDailyFallback(symbol, interval, limit, from, to);
        if (fallback.payload) {
          if (cacheable) marketDataCache.set(cacheKey, { savedAt: Date.now(), ttlMs: ttlSeconds * 1000, payload: fallback.payload });
          return json(fallback.payload, 200, ttlSeconds);
        }
        return json({ error: "Tickerbot is not configured and the secondary historical provider is unavailable.", fallbackError: fallback.error }, 503);
      }

      const endpoint = new URL(`https://api.tickerbot.io/v2/bars/${symbol}/${interval}`);
      endpoint.searchParams.set("limit", String(limit));
      if (cursor) endpoint.searchParams.set("cursor", cursor);
      if (from) endpoint.searchParams.set("from", from);
      if (to) endpoint.searchParams.set("to", to);
      if (subHour) endpoint.searchParams.set("session", session);
      const response = await fetch(endpoint, {
        headers: { "Accept": "application/json", "Authorization": `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(20000),
      });

      if (!response.ok) {
        const fallback = await alphaVantageDailyFallback(symbol, interval, limit, from, to);
        if (fallback.payload) {
          if (cacheable) marketDataCache.set(cacheKey, { savedAt: Date.now(), ttlMs: ttlSeconds * 1000, payload: fallback.payload });
          return json(fallback.payload, 200, ttlSeconds);
        }
        return json({
          error: response.status === 429
            ? "Tickerbot rate limit reached; the secondary provider could not supply this interval."
            : response.status === 403
            ? "Tickerbot denied this interval; the secondary provider could not supply it."
            : "Tickerbot historical bars are unavailable and the secondary provider returned no usable data.",
          provider: "tickerbot",
          providerStatus: response.status,
          fallbackError: fallback.error,
        }, response.status === 429 ? 429 : response.status === 503 ? 503 : 502);
      }

      const data = await response.json();
      if (!Array.isArray(data.bars) || data.coverage === "no_data") {
        const fallback = await alphaVantageDailyFallback(symbol, interval, limit, from, to);
        if (fallback.payload) {
          if (cacheable) marketDataCache.set(cacheKey, { savedAt: Date.now(), ttlMs: ttlSeconds * 1000, payload: fallback.payload });
          return json(fallback.payload, 200, ttlSeconds);
        }
        return json({
          error: "Tickerbot returned no historical bars and the secondary provider returned no usable data.",
          provider: "tickerbot", symbol, interval,
          coverage: data.coverage || "unknown",
          fallbackError: fallback.error,
          asOf: data.as_of || null,
        }, 422);
      }

      const result = {
        provider: "tickerbot",
        symbol: data.ticker || symbol,
        interval: data.interval || interval,
        asOf: data.as_of || null,
        count: data.count ?? data.bars.length,
        coverage: data.coverage || "unknown",
        adjusted: data.adjusted ?? null,
        session: data.session || (subHour ? session : null),
        bars: data.bars,
        nextCursor: data.next_cursor ?? null,
        dataStatus: "provider_response",
        note: "Historical OHLCV bars from Tickerbot. Refresh timing and entitlements depend on the provider account. Not investment advice.",
      };
      if (cacheable) {
        marketDataCache.set(cacheKey, { savedAt: Date.now(), ttlMs: ttlSeconds * 1000, payload: result });
        if (marketDataCache.size > 250) {
          const oldest = marketDataCache.keys().next().value;
          if (oldest) marketDataCache.delete(oldest);
        }
      }
      return json(result, 200, ttlSeconds);
    }

    if (provider === "coinbase-crypto-snapshot") {
      if (!/^[A-Z0-9]{2,15}$/.test(symbol) || symbol === "USD") {
        return json({ error: "Provide a base crypto symbol such as BTC, ETH, or SOL." }, 400);
      }
      const productId = symbol + "-USD";
      const baseUrl = "https://api.exchange.coinbase.com/products/" + encodeURIComponent(productId);
      try {
        const [tickerResponse, statsResponse] = await Promise.all([
          fetch(baseUrl + "/ticker", {
            headers: { "Accept": "application/json", "User-Agent": "ROLyfe-Personal-Trading-Desk/1.0" },
            signal: AbortSignal.timeout(10000),
          }),
          fetch(baseUrl + "/stats", {
            headers: { "Accept": "application/json", "User-Agent": "ROLyfe-Personal-Trading-Desk/1.0" },
            signal: AbortSignal.timeout(10000),
          }),
        ]);
        if (!tickerResponse.ok) {
          return json({
            error: tickerResponse.status === 404
              ? "Coinbase Exchange does not list the " + productId + " spot market."
              : tickerResponse.status === 429
              ? "Coinbase Exchange public market-data rate limit reached."
              : "Coinbase Exchange ticker request failed.",
            provider: "coinbase", productId, providerStatus: tickerResponse.status,
          }, tickerResponse.status === 429 ? 429 : 502);
        }
        const ticker = await tickerResponse.json();
        const stats = statsResponse.ok ? await statsResponse.json() : {};
        const price = Number(ticker.price);
        const bid = Number(ticker.bid);
        const ask = Number(ticker.ask);
        const open = Number(stats.open);
        const changePercent = Number.isFinite(price) && price > 0 && Number.isFinite(open) && open > 0
          ? ((price - open) / open) * 100
          : null;
        if (!Number.isFinite(price) || price <= 0) {
          return json({ error: "Coinbase Exchange returned no usable last trade for " + productId + ".", provider: "coinbase", productId }, 422);
        }
        return json({
          provider: "coinbase", symbol, productId, price,
          bid: Number.isFinite(bid) && bid > 0 ? bid : null,
          ask: Number.isFinite(ask) && ask > 0 ? ask : null,
          high: Number.isFinite(Number(stats.high)) && Number(stats.high) > 0 ? Number(stats.high) : null,
          low: Number.isFinite(Number(stats.low)) && Number(stats.low) > 0 ? Number(stats.low) : null,
          change: Number.isFinite(open) && open > 0 ? price - open : null,
          changePercent,
          timestamp: ticker.time || null,
          volume24h: Number.isFinite(Number(ticker.volume)) ? Number(ticker.volume) : null,
          dataStatus: "provider_response",
          note: "Coinbase Exchange public spot ticker. Bid/ask is venue-specific and may differ from other exchanges; verify price and timestamp before any order.",
        });
      } catch {
        return json({ error: "Coinbase Exchange spot ticker could not be reached.", provider: "coinbase", productId }, 502);
      }
    }

    if (provider === "coingecko") {
      const coinIds: Record<string, string> = {
        BTC: "bitcoin",
        ETH: "ethereum",
        SOL: "solana",
        XRP: "ripple",
        LINK: "chainlink",
        HYPE: "hyperliquid",
        AVAX: "avalanche-2",
        DOGE: "dogecoin",
      };

      if (!Object.hasOwn(coinIds, symbol)) {
        return json({
          error: "Unsupported crypto symbol. Choose BTC, ETH, SOL, XRP, LINK, HYPE, AVAX, or DOGE.",
          provider: "coingecko",
        }, 400);
      }

      const apiKey = Deno.env.get("COINGECKO_API_KEY");
      if (!apiKey) {
        return json({ error: "CoinGecko is not configured in Edge Function Secrets." }, 503);
      }

      const endpoint = new URL("https://api.coingecko.com/api/v3/simple/price");
      endpoint.searchParams.set("ids", coinIds[symbol]);
      endpoint.searchParams.set("vs_currencies", "usd");
      endpoint.searchParams.set("include_24hr_change", "true");
      endpoint.searchParams.set("include_last_updated_at", "true");

      const response = await fetch(endpoint, {
        headers: {
          "Accept": "application/json",
          "x-cg-demo-api-key": apiKey,
        },
      });

      if (!response.ok) {
        return json({
          error: "CoinGecko request failed. Check the Demo API key, plan access, and usage limits.",
          provider: "coingecko",
          providerStatus: response.status,
        }, response.status === 429 ? 429 : 502);
      }

      const data = await response.json();
      const coin = data[coinIds[symbol]];
      const price = Number(coin?.usd);
      if (!Number.isFinite(price) || price <= 0) {
        return json({
          error: "CoinGecko returned no usable price for this coin.",
          provider: "coingecko",
          symbol,
        }, 422);
      }

      return json({
        provider: "coingecko",
        symbol,
        coinId: coinIds[symbol],
        price,
        changePercent24h: typeof coin.usd_24h_change === "number" ? coin.usd_24h_change : null,
        lastUpdatedAt: typeof coin.last_updated_at === "number" ? coin.last_updated_at : null,
        dataStatus: "provider_response",
        note: "Crypto data timing depends on CoinGecko Demo API availability and plan limits. Not investment advice.",
      });
    }

    if (!/^[A-Z0-9.^_-]{1,20}$/.test(symbol)) {
      return json({ error: "Provide a valid ticker symbol, for example AAPL or MSFT." }, 400);
    }

    if (provider !== "finnhub" && provider !== "alphavantage") {
      return json({ error: "Unsupported provider. Choose tickerbot, finnhub, alphavantage, or coingecko." }, 400);
    }

    if (provider === "finnhub") {
      const apiKey = Deno.env.get("FINNHUB_API_KEY");
      if (!apiKey) return json({ error: "Finnhub is not configured in Edge Function Secrets." }, 503);

      const endpoint = new URL("https://finnhub.io/api/v1/quote");
      endpoint.searchParams.set("symbol", symbol);
      endpoint.searchParams.set("token", apiKey);

      const response = await fetch(endpoint, { headers: { "Accept": "application/json" } });
      if (!response.ok) {
        return json({ error: "Finnhub request failed.", provider: "finnhub", providerStatus: response.status }, 502);
      }
      const data = await response.json();
      if (typeof data.c !== "number" || data.c <= 0) {
        return json({
          error: "Finnhub returned no usable quote for this symbol. Check the ticker and your account's data access.",
          provider: "finnhub",
          symbol,
        }, 422);
      }
      return json({
        provider: "finnhub",
        symbol,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
        timestamp: data.t,
        dataStatus: "provider_response",
        note: "Quote timing and entitlement depend on the provider account. Not investment advice.",
      });
    }

    const apiKey = Deno.env.get("ALPHA_VANTAGE_API_KEY");
    if (!apiKey) return json({ error: "Alpha Vantage is not configured in Edge Function Secrets." }, 503);

    const endpoint = new URL("https://www.alphavantage.co/query");
    endpoint.searchParams.set("function", "GLOBAL_QUOTE");
    endpoint.searchParams.set("symbol", symbol);
    endpoint.searchParams.set("apikey", apiKey);

    const response = await fetch(endpoint, { headers: { "Accept": "application/json" } });
    if (!response.ok) {
      return json({ error: "Alpha Vantage request failed.", provider: "alphavantage", providerStatus: response.status }, 502);
    }
    const data = await response.json();
    if (data.Note || data.Information) {
      return json({
        error: "Alpha Vantage reported a usage limit or access notice.",
        provider: "alphavantage",
        detail: String(data.Note || data.Information).slice(0, 300),
      }, 429);
    }
    const quote = data["Global Quote"];
    const price = Number(quote?.["05. price"]);
    if (!Number.isFinite(price) || price <= 0) {
      return json({
        error: "Alpha Vantage returned no usable quote. Data access may be limited for this endpoint.",
        provider: "alphavantage",
        symbol,
      }, 422);
    }
    return json({
      provider: "alphavantage",
      symbol: quote["01. symbol"] || symbol,
      price,
      change: Number(quote["09. change"]),
      changePercent: quote["10. change percent"],
      high: Number(quote["03. high"]),
      low: Number(quote["04. low"]),
      open: Number(quote["02. open"]),
      previousClose: Number(quote["08. previous close"]),
      latestTradingDay: quote["07. latest trading day"],
      dataStatus: "provider_response",
      note: "Quote timing and entitlement depend on the provider account. Not investment advice.",
    });
  } catch {
    return json({ error: "Market-data request could not be completed. Provider details were not exposed." }, 502);
  }
});
