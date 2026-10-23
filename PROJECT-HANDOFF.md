# RO’Lyfe Trading Intelligence Classroom — Project Handoff

**Project:** RO’Lyfe Trading Intelligence Classroom™  
**Repository:** https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom  
**Live site:** https://rolrichman.github.io/RO-Lyfe-Trading-Intelligence-Classroom/  
**Current baseline:** Stage 1 Market Room merged into `main`  
**Merge commit reported by GitHub:** `4311b35`  
**Handoff date:** 2026-10-23

## 1. Mission and product intent

A mobile-first, high-tech trading education classroom built around the RO’Lyfe stock-first method:

1. Study the larger chart structure.
2. Map the setup through 6M/1D → 4H → 1H → 15m → 5m.
3. Define the underlying stock’s entry and invalidation before considering an option.
4. Plan risk, targets, exits and review notes before any real-money decision.
5. Learn and practice using illustrative examples.

The classroom is educational software—not a broker, investment adviser, live signal service, or guarantee of trading results.

## 2. Stage 1 delivered

The `stage-1-market-room` branch was merged into `main` through pull request #1. GitHub displayed one successful check and no merge conflicts at merge time.

### Market Room

- `index.html`: Market Room section, navigation link, and hero entry point.
- `css/market-room.css`: responsive Market Room styling.
- `js/market-room.js`: sample watchlists for stocks, crypto and futures; generated illustrative candlestick chart; sample context labels; timeframe selector; refresh button; and stock-first 1R/2R/3R risk worksheet.
- `README.md`: scope, limitations, and testing notes.

### Existing classroom features retained

- Chart Intelligence Lab with illustrative chart and indicator panels.
- Strategy Advantage tabs.
- Stock-First Trade Planner.
- Classroom lesson modules.
- Local practice journal and JSON export.
- AI helper that builds a prompt; it does not call an AI API.
- Trading ecosystem links and mobile navigation.

### Test tooling added

- `package.json`: Playwright test command and dependency.
- `playwright.config.js`: desktop Chromium and mobile Chromium/Pixel 7 projects, served locally with Python's static HTTP server.
- `tests/classroom.spec.js`: nine end-to-end test cases covering core navigation, Market Room controls and chart, long/short risk calculations, invalid stop placement, Chart Lab, strategy tabs, trade planner, journal persistence/export, AI prompt helper, and mobile layout/menu.
- `.github/workflows/classroom-tests.yml`: attempts to run browser checks on branch pushes, pull requests targeting `stage-1-market-room`, or manual dispatch.

## 3. Data integrity and known limitations

**Do not describe the current Market Room as live market data.**

- All Market Room prices/candles, watchlists’ bias labels, and posture descriptions are illustrative sample data.
- The timeframe selector changes the displayed study label; it does not fetch or resample historical market data.
- No market-data provider, API credentials, backend, user account system, or brokerage integration is configured.
- The existing AI helper is a local prompt builder only.
- The 1R/2R/3R worksheet is simple arithmetic. It does not account for fees, slippage, gaps, futures contract multipliers, or options pricing.
- Stock-chart invalidation and option-premium risk are different measures. Do not represent the stock stop as a reliable option-loss estimate.
- A GitHub “successful check” is not, by itself, proof that all Playwright desktop/mobile tests passed unless the check details show that exact workflow and successful job.

## 4. Verification status at handoff

### Confirmed from the available project review

- Stage 1 code is merged into `main`.
- The user opened the deployed GitHub Pages site and shared its rendered content.
- The live page displays the Market Room and existing classroom sections.
- Source-level JavaScript syntax and selector checks were previously performed.
- The Market Room risk worksheet source contains long/short validation and 1R/2R/3R arithmetic.

### Still to verify explicitly

- Open GitHub **Actions → Classroom browser tests** and inspect the latest run, including desktop and mobile results. Record the run URL and outcome here.
- Test long example: entry 100, stop 98, units 10 → risk $20; targets 102, 104, 106.
- Test short example: entry 100, stop 102, units 10 → risk $20; targets 98, 96, 94.
- Test invalid long example: entry 100, stop 101 → warning should appear.
- Switch Stocks → Crypto → Futures; confirm the symbol list and chart title update.
- Change timeframe and refresh; confirm the chart still renders and the label updates.
- On a narrow phone viewport, confirm no horizontal page overflow and verify the menu opens and closes after navigation.
- Check the browser console for uncaught errors.
- Verify the deployed page reflects the latest `main` commit after GitHub Pages finishes publishing.

**Status:** The feature is merged and visible on the live site, but a full desktop/mobile browser-test pass has not been independently confirmed in this handoff.

## 5. How to run the browser suite locally

Requires Node.js 20 or newer and Python 3.

```bash
npm install
npx playwright install chromium
npm test
```

The Playwright configuration starts a static server at `http://127.0.0.1:4173`. Review the test report and any failure artifacts; fix failures before marking the suite green.

## 6. Suggested next steps

1. **Close the verification loop:** confirm the exact GitHub Actions run and perform the manual risk and mobile checks.
2. **Fix defects before expanding scope:** correct any failing assertions or user-facing behavior, and re-run tests.
3. **Improve accessibility and mobile usability:** confirm readable contrast, keyboard navigation, visible focus, and chart labels.
4. **Keep sample data clearly labeled:** retain “illustrative/sample” and “no live feed” language until a data provider is implemented.
5. **Plan a future live-data stage separately:** select a licensed provider, use a trusted server-side endpoint for credentials, document rate limits and data timestamps, and add tests for loading, stale data, errors, and provider outages. Never expose secret API keys in browser JavaScript.
6. **Keep changes branch-based:** create a focused feature branch, test it, open a pull request, review the diff and checks, and merge only after review.

## 7. Handoff rules

- Keep `main` deployable and avoid unreviewed direct edits.
- Do not overwrite unrelated classroom features when updating `index.html`.
- Do not claim live prices, predictive signals, or brokerage execution without a real, tested implementation.
- Preserve the educational and risk disclosures.
- Update this handoff when test status, integrations, deployment behavior, or project scope changes.

## 8. Useful links

- [Repository](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom)
- [Live classroom / Market Room](https://rolrichman.github.io/RO-Lyfe-Trading-Intelligence-Classroom/#market-room)
- [GitHub Actions](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions)
- [Playwright documentation](https://playwright.dev/docs/intro)

## Stage 2 work in progress — Integrated Market Workstation

**Branch:** `stage-2-integrated-market-workstation`  
**Review status:** Not merged to `main`; run the browser workflow and inspect the PR before merging.

This branch adds `css/market-workstation.css` and `js/market-workstation.js`, updates `index.html`, and documents the new behavior in `README.md`. The new workstation has two separate TradingView embedded chart rooms (stocks/ETFs and crypto), interval controls (1m, 5m, 10m, 15m, 30m, 1h, 2h, 4h, 1D), lookback windows (5D, 1M, 3M, 6M, 1Y), a broader stock/ETF list, 30 crypto pairs, market context links, and an interactive pre-trade checklist.

**Important boundary:** this is embedded TradingView charting, not yet a first-party backend market-data engine. Quote timing, exchange coverage and studies depend on TradingView entitlements and provider support. The existing Market Room and Chart Lab still use illustrative sample data. No provider API keys are added to the branch. Provider API integrations, server-side secrets, true OHLC aggregation, tested indicator calculations over provider bars, options quote integration, and a live AI connection remain future implementation tasks.

**Required validation before merge:** confirm the GitHub Actions browser suite on this branch; inspect desktop and mobile layout; verify that both embedded charts render and that symbol, interval and range controls reload correctly; verify behavior when TradingView is blocked/unavailable; confirm no horizontal overflow; review browser console errors. If chart script loading fails, the UI should show an explanatory message rather than claiming the chart is live.

**Security:** keys or webhook secrets pasted into chat should be rotated. Keep all replacement credentials server-side, such as Supabase Edge Function secrets; never embed them in public JavaScript or HTML.
