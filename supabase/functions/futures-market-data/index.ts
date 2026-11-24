/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};

const ALLOWED_PRODUCTS = new Set(["ES", "NQ", "YM", "RTY", "CL"]);
const TIMEFRAMES = [
  { key: "1d", resolution: "1session", stepMs: 23 * 60 * 60 * 1000 },
  { key: "4h", resolution: "4hour", stepMs: 4 * 60 * 60 * 1000 },
  { key: "1h", resolution: "1hour", stepMs: 60 * 60 * 1000 },
  { key: "15m", resolution: "15min", stepMs: 15 * 60 * 1000 },
  { key: "5m", resolution: "5min", stepMs: 5 * 60 * 1000 }
];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}
function validDate(value: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : new Date().toISOString().slice(0, 10);
}
function errorMessage(body: any, fallback: string) {
  return String(body?.error || body?.message || body?.status || fallback).slice(0, 500);
}
async function massiveGet(path: string, params: Record<string, string>, apiKey: string) {
  const url = new URL(path, "https://api.massive.com");
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set("apiKey", apiKey);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, { method: "GET", headers: { Accept: "application/json" }, signal: controller.signal });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error("Massive Futures returned HTTP " + response.status + ": " + errorMessage(body, "provider request failed"));
    }
    return body;
  } finally {
    clearTimeout(timeout);
  }
}
function productForContract(contract: string) {
  return ["RTY", "NQ", "YM", "ES", "CL"].find(prefix => contract.startsWith(prefix)) || null;
}
function latestAsOf(bars: any[], stepMs: number) {
  const last = bars[bars.length - 1];
  const raw = Number(last?.window_start);
  if (!Number.isFinite(raw)) return null;
  const millis = raw > 1e16 ? raw / 1e6 : raw > 1e12 ? raw : raw * 1000;
  return new Date(millis + stepMs).toISOString();
}
function normalizeContract(item: any) {
  return {
    ticker: String(item.ticker || ""),
    productCode: String(item.product_code || ""),
    name: String(item.name || ""),
    active: item.active === true,
    daysToMaturity: Number.isFinite(Number(item.days_to_maturity)) ? Number(item.days_to_maturity) : null,
    lastTradeDate: item.last_trade_date || null,
    settlementDate: item.settlement_date || null,
    tradingVenue: item.trading_venue || null,
    tradeTickSize: Number.isFinite(Number(item.trade_tick_size)) ? Number(item.trade_tick_size) : null,
    minOrderQuantity: Number.isFinite(Number(item.min_order_quantity)) ? Number(item.min_order_quantity) : null,
    maxOrderQuantity: Number.isFinite(Number(item.max_order_quantity)) ? Number(item.max_order_quantity) : null
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return json({ error: "Method not allowed. Use GET." }, 405);

  const apiKey = Deno.env.get("ROLYFE_RTIC_MARKET_INTELLIGENCE");
  if (!apiKey) {
    return json({
      error: "Massive API key is not configured in Supabase Edge Function Secrets.",
      code: "MASSIVE_KEY_MISSING",
      provider: "Massive Futures"
    }, 503);
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "contracts";
  const product = String(url.searchParams.get("product") || "ES").toUpperCase();

  try {
    if (action === "contracts") {
      if (!ALLOWED_PRODUCTS.has(product)) return json({ error: "Unsupported futures product code.", allowed: [...ALLOWED_PRODUCTS] }, 400);
      const date = validDate(url.searchParams.get("date"));
      const data = await massiveGet("/futures/v1/contracts", {
        product_code: product,
        date,
        active: "true",
        type: "single",
        limit: "100",
        sort: "days_to_maturity.asc"
      }, apiKey);
      const contracts = Array.isArray(data.results)
        ? data.results.map(normalizeContract).filter((c: any) => c.active && c.ticker && c.productCode === product)
            .sort((a: any, b: any) => (a.daysToMaturity ?? 999999) - (b.daysToMaturity ?? 999999))
        : [];
      return json({
        status: contracts.length ? "OK" : "NO_ACTIVE_CONTRACTS",
        provider: "Massive Futures",
        dataStatus: "provider_response",
        product, date, contracts,
        providerStatus: data.status || "unknown",
        note: "Contracts are provider-listed. Check expiry, roll timing, liquidity and tick size before research or execution."
      });
    }

    if (action === "frames") {
      const contract = String(url.searchParams.get("contract") || "").toUpperCase();
      const productCode = productForContract(contract);
      if (!/^[A-Z0-9]{3,10}$/.test(contract) || !productCode || !ALLOWED_PRODUCTS.has(productCode)) {
        return json({ error: "A valid Massive futures contract ticker is required (for example, ESZ6).", code: "INVALID_CONTRACT" }, 400);
      }

      const results = await Promise.all(TIMEFRAMES.map(async timeframe => {
        const data = await massiveGet("/futures/v1/aggs/" + encodeURIComponent(contract), {
          resolution: timeframe.resolution,
          limit: "500",
          sort: "window_start.asc"
        }, apiKey);
        const bars = Array.isArray(data.results) ? data.results : [];
        return {
          timeframe: timeframe.key,
          frame: {
            provider: "Massive Futures",
            dataStatus: "provider_response",
            asOf: latestAsOf(bars, timeframe.stepMs),
            providerStatus: data.status || "unknown",
            bars
          }
        };
      }));

      const frames: Record<string, any> = {};
      const emptyFrames: string[] = [];
      results.forEach(item => {
        frames[item.timeframe] = item.frame;
        if (!item.frame.bars.length) emptyFrames.push(item.timeframe);
      });
      return json({
        status: emptyFrames.length ? "PARTIAL_DATA" : "OK",
        provider: "Massive Futures",
        dataStatus: "provider_response",
        contract, product: productCode,
        fetchedAt: new Date().toISOString(),
        frames, emptyFrames,
        note: "Feed timestamps and actual provider coverage control freshness. 8-hour historical or delayed responses will be marked stale by the shared Futures Bias engine; no real-time entitlement is assumed."
      });
    }

    return json({ error: "Unsupported action. Use action=contracts or action=frames." }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown provider error.";
    return json({
      error: message,
      code: message.includes("HTTP 429") ? "PROVIDER_RATE_LIMIT" : "MASSIVE_FUTURES_UNAVAILABLE",
      provider: "Massive Futures",
      note: "Check Futures API entitlement, contract coverage, rate limits and the server-side Massive key. The existing market-data v45 function was not modified."
    }, 502);
  }
});
