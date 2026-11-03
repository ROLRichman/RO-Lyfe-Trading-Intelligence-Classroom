import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, accept",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
const languages = ["English", "Spanish", "French", "Haitian Creole", "Portuguese"];
const requestTimes = new Map<string, number[]>();

function reply(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}
function getOutput(result: any): string {
  if (typeof result.output_text === "string" && result.output_text.trim()) return result.output_text.trim();
  if (Array.isArray(result.output)) return result.output.flatMap((item: any) => Array.isArray(item.content) ? item.content : [])
    .filter((part: any) => part.type === "output_text").map((part: any) => part.text || "").join("\n").trim();
  return "";
}
function parseTranslations(raw: string): string[] | null {
  try {
    const value = JSON.parse(raw.trim());
    if (Array.isArray(value)) return value;
    if (value && Array.isArray(value.translations)) return value.translations;
  } catch (_) {}
  const start = raw.indexOf("{"), end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try { const value = JSON.parse(raw.slice(start, end + 1)); if (value && Array.isArray(value.translations)) return value.translations; } catch (_) {}
  }
  return null;
}
function rateLimited(req: Request): boolean {
  const forwarded = req.headers.get("x-forwarded-for") || "shared";
  const key = forwarded.split(",")[0].trim() || "shared";
  const now = Date.now();
  const recent = (requestTimes.get(key) || []).filter(time => now - time < 60000);
  if (recent.length >= 50) return true;
  recent.push(now); requestTimes.set(key, recent); return false;
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "Use POST." }, 405);
  if (rateLimited(req)) return reply({ error: "Translation request limit reached. Retry in one minute." }, 429);
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return reply({ error: "Page translation is not configured. Add OPENAI_API_KEY to this Supabase project's Edge Function Secrets." }, 503);
  try {
    const body = await req.json();
    const language = String(body.language || "").trim();
    const segments = body.segments;
    if (!languages.includes(language)) return reply({ error: "Choose one of the five RO'Lyfe languages." }, 400);
    if (!Array.isArray(segments) || segments.length < 1 || segments.length > 35 ||
        segments.some((value: unknown) => typeof value !== "string" || !value.trim() || value.length > 1200)) {
      return reply({ error: "Send 1–35 non-empty text segments. Each must be 1,200 characters or fewer." }, 400);
    }
    const totalChars = segments.reduce((sum: number, value: string) => sum + value.length, 0);
    if (totalChars > 4400) return reply({ error: "A translation batch cannot exceed 4,400 characters." }, 413);
    const instructions = [
      "You are the RO'Lyfe global interface translator.",
      "Translate every string in the supplied JSON array into " + language + ".",
      "Return only a valid JSON object with one property named translations. Its value must be an array of strings with exactly the same count and order as the input.",
      "Translate interface labels, headings, help text, button labels, statuses, placeholders and accessibility labels naturally.",
      "Preserve numbers, prices, ticker symbols, stock and crypto symbols, brand names, code identifiers, formulas, order types, dates, percentages, currency symbols, URLs and special placeholders exactly.",
      "Do not add explanations, market advice, markdown or commentary. Do not omit or combine segments."
    ].join(" ");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4.1-mini", instructions, input: JSON.stringify(segments), max_output_tokens: 5000 }),
      signal: AbortSignal.timeout(30000)
    });
    const result = await response.json();
    if (!response.ok) return reply({
      error: response.status === 401 ? "The OpenAI key was rejected. Check OPENAI_API_KEY." :
        response.status === 429 ? "The AI provider quota or rate limit was reached." : "The page translation AI request failed.",
      providerStatus: response.status
    }, response.status === 429 ? 429 : 502);
    const translations = parseTranslations(getOutput(result));
    if (!translations || translations.length !== segments.length || translations.some(value => typeof value !== "string" || !value.trim())) {
      return reply({ error: "The AI provider returned an invalid or incomplete translation batch." }, 502);
    }
    return reply({ translations, language, count: translations.length, model: "gpt-4.1-mini" });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : "Unexpected page translation failure." }, 500);
  }
});