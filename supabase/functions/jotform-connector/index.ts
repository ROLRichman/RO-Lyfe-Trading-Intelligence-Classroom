import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-rol-read-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

const ALLOWED_FORMS: Record<string, string> = {
  "252063354378055": "RO'Lyfe Loan Experts (Funding)",
  "253096731021046": "RO'Lyfe Application + (DropBox)",
  "261577616896071": "BUSINESS LOAN APPLICATION",
  "261416399941062": "RO’Lyfe Funding Portal",
  "261436718486063": "RO'Lyfe Hybrid Rehab + Funding Packet",
  "253154859148062": "RO'Lyfe Quick Dropbox (Contracts, Docs etc)",
};

const SENSITIVE_LABEL = /ssn|social security|date of birth|\bdob\b|birth date|driver.?s license|passport|bank|routing|account number|account #|tax id|\bEIN\b|credit report|tax return|password|signature|proof of funds upload|upload.*(document|id|tax|bank|credit)|(?:document|id|tax|bank|credit).*upload/i;
const FILE_TYPES = /fileupload|signature|payment|captcha/i;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function asNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function jotformRequest(path: string, apiKey: string) {
  const response = await fetch(`https://api.jotform.com${path}`, {
    method: "GET",
    headers: { "APIKEY": apiKey, "Accept": "application/json" },
    signal: AbortSignal.timeout(20000),
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

function safeAnswer(answer: unknown, label: string, type: string): { value: unknown; redacted: boolean } {
  if (SENSITIVE_LABEL.test(label) || FILE_TYPES.test(type)) {
    return { value: "[REDACTED - sensitive field or attachment]", redacted: true };
  }

  if (answer === null || answer === undefined || answer === "") {
    return { value: null, redacted: false };
  }

  if (typeof answer === "string" || typeof answer === "number" || typeof answer === "boolean") {
    const value = String(answer);
    if (/https?:\/\//i.test(value) && /(upload|file|document|attachment)/i.test(label + " " + type)) {
      return { value: "[REDACTED - attachment link]", redacted: true };
    }
    return { value, redacted: false };
  }

  if (Array.isArray(answer)) {
    const safe = answer
      .filter((item) => ["string", "number", "boolean"].includes(typeof item))
      .map((item) => String(item));
    return { value: safe.length ? safe : "[Structured answer omitted]", redacted: safe.length === 0 };
  }

  if (typeof answer === "object") {
    const record = answer as Record<string, unknown>;
    const values = Object.entries(record)
      .filter(([key, value]) =>
        !/url|file|upload|path|token|signature|base64/i.test(key) &&
        ["string", "number", "boolean"].includes(typeof value)
      )
      .map(([, value]) => String(value))
      .filter(Boolean);
    return values.length
      ? { value: values.join(" ").slice(0, 1000), redacted: false }
      : { value: "[Structured or attachment data omitted]", redacted: true };
  }

  return { value: "[Unsupported answer type omitted]", redacted: true };
}

function normalizeSubmission(raw: Record<string, unknown>) {
  const rawAnswers = raw.answers && typeof raw.answers === "object"
    ? raw.answers as Record<string, Record<string, unknown>>
    : {};

  const answers = Object.entries(rawAnswers).map(([qid, item]) => {
    const label = String(item?.text || item?.name || `Question ${qid}`);
    const type = String(item?.type || "");
    const normalized = safeAnswer(item?.answer ?? item?.prettyFormat ?? null, label, type);
    return {
      questionId: qid,
      label,
      type,
      value: normalized.value,
      redacted: normalized.redacted,
    };
  });

  return {
    submissionId: String(raw.id || ""),
    createdAt: raw.created_at || null,
    updatedAt: raw.updated_at || null,
    status: raw.status || null,
    reviewAnswers: answers,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);

  const apiKey = Deno.env.get("JOTFORM_API_KEY");
  if (!apiKey) {
    return json({ ok: false, error: "JOTFORM_API_KEY is not configured in Supabase Edge Function Secrets." }, 503);
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
        enabledActions: ["status", "forms", "submissions"],
        note: "Connection verified. Submission retrieval is separately token-protected and read-only.",
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

    if (action === "submissions") {
      const expectedToken = Deno.env.get("JOTFORM_READ_ACCESS_TOKEN");
      const suppliedToken = req.headers.get("x-rol-read-token") || "";
      if (!expectedToken) {
        return json({
          ok: false,
          error: "JOTFORM_READ_ACCESS_TOKEN is not configured. Add this separate secret before enabling private submission retrieval.",
        }, 503);
      }
      if (!suppliedToken || !constantTimeEqual(suppliedToken, expectedToken)) {
        return json({ ok: false, error: "Unauthorized. A valid private read-access token is required." }, 401);
      }

      const requestedIds = Array.isArray(body.formIds)
        ? body.formIds.map((id) => String(id))
        : Object.keys(ALLOWED_FORMS);
      if (!requestedIds.length || requestedIds.length > Object.keys(ALLOWED_FORMS).length ||
          requestedIds.some((id) => !Object.prototype.hasOwnProperty.call(ALLOWED_FORMS, id))) {
        return json({ error: "formIds must contain only the six approved Root Of Lyfe form IDs." }, 400);
      }

      const rawLimit = asNumber(body.limit);
      const rawOffset = asNumber(body.offset);
      const limit = Math.max(1, Math.min(1000, Math.floor(rawLimit ?? 100)));
      const offset = Math.max(0, Math.floor(rawOffset ?? 0));

      const results: Array<{ formId: string; formTitle: string; offset: number; limit: number; returned: number; hasMore: boolean; nextOffset: number | null; submissions: ReturnType<typeof normalizeSubmission>[] }> = [];
      let apiCallsRemaining: number | null = null;
      for (const formId of requestedIds) {
        const query = new URLSearchParams({
          limit: String(limit),
          offset: String(offset),
          orderby: "created_at",
        });
        const payload = await jotformRequest(`/form/${formId}/submissions?${query.toString()}`, apiKey);
        apiCallsRemaining = asNumber(payload["limit-left"]);
        const rawSubmissions = Array.isArray(payload.content) ? payload.content : [];
        const submissions = rawSubmissions.map((item: Record<string, unknown>) => normalizeSubmission(item));
        results.push({
          formId,
          formTitle: ALLOWED_FORMS[formId],
          offset,
          limit,
          returned: submissions.length,
          hasMore: submissions.length === limit,
          nextOffset: submissions.length === limit ? offset + submissions.length : null,
          submissions,
        });
      }

      return json({
        ok: true,
        provider: "jotform",
        action: "submissions",
        readOnly: true,
        sourceRecordsChanged: false,
        emailsSent: false,
        applicationEditsMade: false,
        sensitiveFieldsRedacted: true,
        attachmentsReturned: false,
        formsProcessed: results.length,
        totalSubmissionsReturned: results.reduce((sum, item) => sum + item.returned, 0),
        results,
        apiCallsRemaining,
        privacyNote: "High-risk identifiers and file-upload fields are redacted. No submission, form, or application is created, edited, flagged, or deleted.",
      });
    }

    return json({ error: "Unsupported action. Use status, forms, or submissions." }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected Jotform connector error.";
    const status = message.includes("rate limit") ? 429 : 502;
    return json({ ok: false, error: message }, status);
  }
});
