# RO’Lyfe Global Page-Language System — Backup & Handoff

Last updated: 2026-11-03

## Purpose

Provide one persistent language selector for the RO’Lyfe web network. Visitors can switch the interface between English, Spanish, French, Haitian Creole and Portuguese. The preference is shared across RO’Lyfe GitHub Pages apps under the `rolrichman.github.io` origin.

This is page-wide interface localization, not only a text-input translator.

## Architecture

- Front-end selector: `rol-translator.js` in each participating repository.
- Shared preference: browser `localStorage` key `rolyfe-translate-language`.
- Cached strings: browser `localStorage` key `rolyfe-page-language-cache-v1`.
- Shared backend: Supabase Edge Function `rol-page-translate`.
- Backend source of truth: `supabase/functions/rol-page-translate/index.ts` in this repository.
- Active Supabase project: `ROLyfe-Trading-Intelligence-Classroom` (`ykmdyfbklvuoseqdjnxy`).
- Edge Function currently deployed as ACTIVE, version 1, with JWT verification enabled.
- Translation provider: OpenAI Responses API, model `gpt-4.1-mini`; requires server-side Edge Function secret `OPENAI_API_KEY`.

## Page behavior and data protection

- Translates eligible text nodes and interface attributes: visible copy, headings, navigation, buttons, labels, placeholders, tooltips, accessible labels and status messages.
- MutationObserver handles newly rendered interface text.
- The selector is mounted outside collapsible mobile navigation so it remains visible on phones.
- Preserves numbers, prices, currency, tickers and symbols where identified, code/formulas, URLs, chart canvases, TradingView embeds, quote fields and calculated values.
- Translation batches have strict segment and character limits, cache prior translations, and restore original text on a failed translation.
- This is UI localization. It does not change provider responses, trading signals, calculations, trades, or property underwriting data.

## Participating GitHub pull requests

| Project | Branch | Pull request |
|---|---|---|
| Tactical Intelligence Center (main + RTIC scanner) | `feature/rol-network-translator-auto-refresh` | https://github.com/ROLRichman/RO-Lyfe-Tactical-Intelligence-Center-/pull/5 |
| Live Sports Center / Market Lab | `feature/rol-network-translator` | https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center/pull/3 |
| Market Terminal | `feature/rol-network-translator` | https://github.com/ROLRichman/rolyfe-market-terminal/pull/11 |
| Trading Calculator Pro / Scanner Hub | `feature/rol-network-translator` | https://github.com/ROLRichman/ROlyfe-Trading-Calculator-Pro/pull/3 |
| Trading Intelligence Classroom / Live Chart Desk | `feature/rol-translator-language-sync` | https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/pull/12 |

These are saved feature branches and open pull requests. Do not assume they are merged or deployed until a merge and Pages deployment are verified.

## Backend verification and remaining setup

- Classroom Supabase project status: ACTIVE_HEALTHY.
- Sports Supabase project status: ACTIVE_HEALTHY.
- `rol-page-translate`: deployed and ACTIVE.
- Live `market-data-status` request authenticated successfully after refreshing the public anon JWT in the shared browser code.
- The status response reports `tradingAiConfigured: false`. Add the secret `OPENAI_API_KEY` in Supabase Dashboard → Project Settings / Edge Function Secrets for `ROLyfe-Trading-Intelligence-Classroom` before expecting live translations. Never place the OpenAI secret in GitHub page code.
- A GitHub Actions backend smoke test checks the configured secret and submits a small live translation batch once setup is complete.
- Supabase performance advisor returned no findings. Security advisor reported existing warnings for `public.rls_auto_enable()` being executable by `anon` and `authenticated` as a SECURITY DEFINER function; this unrelated database function was not modified.

## Other backend note

The `ROLyfe-Auction-Capital-Machine` Supabase project is currently INACTIVE. The Root Of Lyfe Supabase organization is on the Free plan with a maximum of two active projects; Classroom and Sports already occupy both slots. Restore was attempted and rejected by that project limit. No healthy project was paused. Restoring Auction requires upgrading the Supabase plan or the owner choosing to pause one of the two active projects.

## Safe deployment checklist

1. Add `OPENAI_API_KEY` to the Classroom Supabase Edge Function Secrets.
2. Confirm the GitHub Actions backend smoke test succeeds.
3. Confirm all five repositories' PR checks pass on their latest heads.
4. Review the pull requests and explicitly approve merges.
5. Verify each GitHub Pages deployment and mobile selector on production pages.
6. Keep this handoff document and the function source versioned in GitHub.
