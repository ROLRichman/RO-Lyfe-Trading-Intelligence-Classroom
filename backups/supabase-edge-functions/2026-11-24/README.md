# Supabase Edge Function backup — 2026-11-24

These files preserve the currently deployed source returned by the Supabase project before any AI-path or Futures Bias changes.

| Function | Deployed version | Status | JWT verification |
|---|---:|---|---|
| market-data | 45 | ACTIVE | true |
| rol-trading-ai | 15 | ACTIVE | true |

Do not deploy an older repository copy of market-data over the deployed v45 function. The current live version contains routes not present in some historic repository snapshots.

Secrets are not included. Function code reads credentials from Supabase Edge Function environment variables.