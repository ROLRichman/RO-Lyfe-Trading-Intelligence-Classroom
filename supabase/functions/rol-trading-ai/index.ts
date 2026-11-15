import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, accept",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
function reply(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "Use POST." }, 405);
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return reply({ error: "Trading AI is not connected. Add OPENAI_API_KEY to this Supabase project's Edge Function Secrets." }, 503);
  try {
    const body = await req.json();
    const action = String(body.action || "analyze");
    const question = String(body.question || "").trim();
    const context = String(body.context || "").slice(0, 10000);
    const requestedMode = String(body.sidekickMode || "coach");
    const sidekickMode = ["coach", "analyst", "professor"].includes(requestedMode) ? requestedMode : "coach";
    const sourceText = String(body.text || "").trim();
    const language = String(body.language || "English").trim();
    let instructions = "";
    let input = "";
    if (action === "translate") {
      const allowed = ["English","Spanish","French","Haitian Creole","Portuguese","German","Italian","Arabic","Chinese (Simplified)","Japanese","Korean","Hindi"];
      if (!allowed.includes(language)) return reply({ error: "Choose one of the twelve available RO'Lyfe languages." }, 400);
      if (!sourceText || sourceText.length > 4000) return reply({ error: "Enter text to translate (up to 4,000 characters)." }, 400);
      instructions = [
        "You are the RO'Lyfe classroom translator.",
        "Translate the user's text faithfully into " + language + ".",
        "Preserve tickers, amounts, dates, formulas, order types, and financial meanings exactly.",
        "Do not add market advice, facts, or commentary. Return only the translation."
      ].join(" ");
      input = sourceText;
    } else if (action === "analyze") {
      if (!question || question.length > 2400) return reply({ error: "Enter a question up to 2,400 characters." }, 400);
      instructions = [
        "You are the RO'Lyfe RTIC Trading Intelligence assistant.",
        "Explain trading concepts clearly and analyze only the market data and calculated values supplied in the context.",
        "Never invent a quote, option premium, spread, implied volatility, Greeks, volume, open interest, catalyst, or timestamp. Clearly label any field that is missing, delayed, assumed, or user-entered.",
        "Use supplied deterministic calculator outputs for arithmetic; do not silently change the numbers. If a required input is missing, say what is missing instead of guessing.",
        "Provide conditional bullish and bearish scenarios when useful, including possible order structures such as buy limit, buy stop, sell limit, or sell stop as educational examples. Explain what would invalidate each scenario.",
        "Do not give individualized commands to buy or sell, promise a profit, predict a guaranteed outcome, or claim an order was placed.",
        "For stock plans, distinguish entry, stop, shares, dollar risk, 1R/2R/3R targets, and position value. For options, distinguish the stock's price from option premium and explain ITM/ATM/OTM only from supplied underlying price and strike.",
        "This assistant cannot access a brokerage account or place, modify, or cancel any trade. It may help prepare a draft for the user to review.",
        "Use readable headings and concise explanations. Explain important labels and calculations."
      ].join(" ");
      const roleGuidance: Record<string, string> = {
        coach: "Trading Coach mode: coach the user through the setup, risk per share or contract, position sizing, invalidation, missing evidence and safer alternatives. Ask useful reflective questions. Never issue a command to trade.",
        analyst: "Market Analyst mode: compare bullish, bearish and neutral scenarios; assess supplied multi-timeframe confluence, catalysts, liquidity, volume and what would change the thesis. Separate observed evidence from uncertainty.",
        professor: "Professor Mode: teach the reasoning step by step in plain language. Define technical terms, explain why each indicator or calculation matters, give a small illustrative example when helpful, and finish with one short knowledge-check question."
      };
      instructions += " " + roleGuidance[sidekickMode];
      const allowedLanguages = ["English","Spanish","French","Haitian Creole","Portuguese","German","Italian","Arabic","Chinese (Simplified)","Japanese","Korean","Hindi"];
      const responseLanguage = allowedLanguages.includes(language) ? language : "English";
      instructions += " Respond in " + responseLanguage + ". Match the user’s selected language naturally. Preserve ticker symbols, prices, dates, formulas, indicator names, order types, and numerical values exactly; do not translate financial identifiers.";
      input = "AVAILABLE PAGE / MARKET CONTEXT:\n" + context + "\n\nUSER QUESTION:\n" + question;
    } else {
      return reply({ error: "Unsupported action. Use analyze or translate." }, 400);
    }
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4.1-mini", instructions, input, max_output_tokens: 900 }),
      signal: AbortSignal.timeout(30000)
    });
    const result = await response.json();
    if (!response.ok) return reply({
      error: response.status === 401 ? "The OpenAI key was rejected. Check OPENAI_API_KEY." :
        response.status === 429 ? "The AI provider quota or rate limit was reached." : "The AI provider request failed.",
      providerStatus: response.status
    }, response.status === 429 ? 429 : 502);
    let answer = String(result.output_text || "");
    if (!answer && Array.isArray(result.output)) {
      answer = result.output.flatMap((item: any) => Array.isArray(item.content) ? item.content : [])
        .filter((part: any) => part.type === "output_text").map((part: any) => part.text || "").join("\n");
    }
    if (!answer) return reply({ error: "The AI provider returned an empty answer." }, 502);
    return reply({ answer, model: "gpt-4.1-mini", usage: result.usage || null, action });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : "Unexpected trading AI failure." }, 500);
  }
});