import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function asNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function jotformRequest(path: string, apiKey: string) {
  const response = await fetch(`https://api.jotform.com${path}`, {
    method: "GET",
    headers: {
      "APIKEY": apiKey,
      "Accept": "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload || payload.responseCode !== 200) {
    const status = response.status || 502;
    throw new Error(
      status === 401 || payload?.responseCode === 401
        ? "Jotform rejected the API key. Check the JOTFORM_API_KEY secret and its permissions."
        : status === 429 || payload?.responseCode === 429
        ? "Jotform API rate limit reached. Try again later."
        : "Jotform API request failed."
    );
  }

  return payload;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);

  const apiKey = Deno.env.get("JOTFORM_API_KEY");
  if (!apiKey) {
    return json({
      ok: false,
      error: "JOTFORM_API_KEY is not configured in this Supabase project's Edge Function Secrets.",
    }, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  const action = String(body.action || "status");

  try {
    if (action === "status") {
      const payload = await jotformRequest("/user", apiKey);
      const account = payload.content || {};
      const accountType = String(account.account_type || "");
      const plan = accountType.split("/").filter(Boolean).pop() || null;

      return json({
        ok: true,
        provider: "jotform",
        connected: true,
        readOnly: true,
        accountStatus: account.status || null,
        plan,
        apiCallsRemaining: asNumber(payload["limit-left"]),
        enabledActions: ["status", "forms"],
        note: "Connection verified. This endpoint does not read form submissions.",
      });
    }

    if (action === "forms") {
      const rawLimit = asNumber(body.limit);
      const rawOffset = asNumber(body.offset);
      const limit = Math.max(1, Math.min(50, Math.floor(rawLimit ?? 25)));
      const offset = Math.max(0, Math.floor(rawOffset ?? 0));
      const query = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        orderby: "updated_at",
      });

      const payload = await jotformRequest(`/user/forms?${query.toString()}`, apiKey);
      const forms = Array.isArray(payload.content) ? payload.content : [];
      const safeForms = forms.map((form: Record<string, unknown>) => {
        const id = String(form.id || "");
        return {
          formId: id,
          title: String(form.title || "Untitled form"),
          status: String(form.status || "UNKNOWN"),
          updatedAt: form.updated_at || null,
          createdAt: form.created_at || null,
          submissionCount: asNumber(form.count),
          newSubmissionCount: asNumber(form.new),
          publicUrl: id ? `https://form.jotform.com/${encodeURIComponent(id)}` : null,
        };
      });

      return json({
        ok: true,
        provider: "jotform",
        readOnly: true,
        submissionsIncluded: false,
        offset,
        limit,
        returned: safeForms.length,
        forms: safeForms,
        apiCallsRemaining: asNumber(payload["limit-left"]),
      });
    }

    return json({ error: "Unsupported action. Use status or forms." }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected Jotform connector error.";
    const status = message.includes("rate limit") ? 429 : 502;
    return json({ ok: false, error: message }, status);
  }
});