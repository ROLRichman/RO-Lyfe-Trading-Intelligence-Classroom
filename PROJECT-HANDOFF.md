# RO’Lyfe Trading Intelligence Classroom — Project Handoff

**Repository:** [ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom)  
**Live site:** https://rolrichman.github.io/RO-Lyfe-Trading-Intelligence-Classroom/  
**Handoff updated:** 2026-11-02  
**Default branch:** `main`  
**Current release branch:** `main`    
**Merged pull request:** [#10 — RTIC Live Desk: Media Hub, Sports embed & AI Co-Pilot](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/pull/10)    
**Latest tested feature head:** `1d0811f80fc08f64cb8af7e4c5d28edd4bae4559`  
**Merge status:** MERGED into `main` on 2026-11-02. Merge commit: `5edde8e2c9a2c4d058d51543db6b5cdc490f03df`. Post-merge desktop/mobile tests and GitHub Pages deployment both succeeded.

---

## 1. Current checkpoint — read this first

### New additive request — awaiting review, not merged

**Branch:** `feature/live-desk-sector-scanner-timeframes-rewards`

This branch is a separate additive change after PR #10. It must not be treated as deployed until its pull request is reviewed, merged and the Pages workflow succeeds.

- Adds four additional Live Desk timeframes supported by the existing Tickerbot function: 30m, 2h, 1w and 1mo. The user’s requested study ladder stays 6M/1D → 4H → 1H → 15m → 5m; no 1m or 1s controls were added.
- Adds a second top-level **Sector Scanner + Chart Lab** dropdown by embedding the existing Market Lab from the Sports Center project. The drawer also has a compact shortcut that opens this top-level dropdown. The original Live Desk scanner and Watchlist remain in place.
- Adds an estimated projected gross profit summary across the four staged option exits, reward/risk ratio, and return on option debit. Example test case: $1.25 entry, $1.1250 stop, four standard contracts produces $125 projected gross profit, 2.50:1 projected reward/risk and 25.0% projected gross return on debit. Results assume every planned exit fills and exclude trading costs, spread, slippage and taxes.
- Adds projected profit to each stock risk ladder target and small fixed Back-to-Top / mid-page controls.
- Adds a Select Language dropdown for the existing five-language translator without removing the five language buttons. It still depends on the server-side AI key.
- Changes the Classroom theme picker from accent-only to five actual background palettes (Ocean Blue, Lyfe Green, Amber, Violet, Crimson). Previous stored `teal` selections map to Crimson for backward compatibility.
- Changes the embedded Sports Center URL to the wider `?embed=classroom` view and adds same-origin iframe height communication to reduce the narrow/tall embedded presentation.

**Verification status:** source and browser tests have been updated on this branch; the new branch has not yet been reviewed or deployed.

- Pull request: [#11 — Add Sector Scanner, projected rewards, more timeframes and classroom themes](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/pull/11).
- Workflow **Classroom browser tests**, run [#138](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41540119711): **passed** on branch head `04c707a5923390a202b4d4233d84bbd2aea91ad3`.
- The test suite covers reward outputs, 1w/1mo programmatic interval acceptance, the Sector Scanner dropdown, all five background palettes and the five-language select.
- Not merged and not deployed. Review the PR and perform a live visual check after any later merge. The Live Desk reward calculation remains a planning estimate, not a broker order. Live/delayed option premium availability still depends on Massive subscription entitlements. No brokerage execution has been added.

### Live Desk media + AI sidekick upgrade

### Live Desk media + AI sidekick upgrade

The merged Live Desk release adds the following work:

- Two featured media players in the Live Desk.
- Expandable channels for Real Estate Intelligence, Weather Intelligence, Trading Education, and RO’Lyfe Learning Network.
- Embedded RO’Lyfe Live Sports Center inside the Live Desk media hub.
- Mute control for the embedded YouTube players (it changes player mute parameters and reloads the players; it is not a native instant mixer).
- Three AI sidekick roles: Trading Coach, Market Analyst, and Professor Mode.
- Server-side role guidance in the Supabase `rol-trading-ai` Edge Function, deployed as version 2 with JWT verification retained.
- Playwright assertions for the media hub, Sports embed, role selector, and role request payload.

- Five-timeframe technical confluence panel: 6M/1D, 4H, 1H, 15M, and 5M. Each timeframe is requested and calculated separately; unavailable provider coverage must be shown as unavailable.
- Adds HMA 32 as a selectable lower-panel study and a chart overlay with direction coloring; EMA/RSI/MACD/Stochastic rows display directional readings.
- Adds option premium stop comparisons for 5%, 7%, 10%, 15%, and 20%; selected presets apply a premium-based stop and recalculate risk/contract, total risk, and budget status. Stop premiums are shown to four decimals; 10% is labeled as the standard planning ceiling; 15%/20% are labeled aggressive.
- Scanner uses the Supabase `market-data` `tickerbot-scan` route. Selecting a watchlist/scanner symbol loads its chart/quote and chart-derived indicators; whole-list scanning remains a manual action.
- Playwright covers scanner expansion, five timeframe cards, HMA controls, and the 10% / 15% option stop calculations.
- Adds a compact in-drawer mobile Watchlist close button; the backdrop and top-level toggle remain supported.

### User review state

**The user reviewed the Live Desk page and explicitly liked its layout and workflow, then authorized the commit and merge.** The additional multi-timeframe posture/HMA upgrades, option premium stop presets, and mobile drawer close control are covered by the passing desktop/mobile browser suite. GitHub Pages deployed the merged release successfully; the user can now review those refinements on the live site.

### Automated test state — PASSED

- Workflow: **Classroom browser tests**
- Feature code head tested before documentation-only follow-ups: `1d0811f80fc08f64cb8af7e4c5d28edd4bae4559`.
- Push run [#122](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41519211343): **passed**.
- Pull-request run [#123](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41519225902): **passed**.
- Documentation-updated branch head `4e05c0467c90fd2cd5a2b9e3fa8b53f5cb0c7bf6`: push run [#126](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41519596689) and PR run [#127](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41519610134) both **passed**.
- Post-merge `main` head `5edde8e2c9a2c4d058d51543db6b5cdc490f03df`: browser run [#128](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41519829942) **passed**.
- GitHub Pages build/deploy run [#81](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41519829081): **passed**.
- Test coverage includes desktop and mobile Chromium, Live Desk structure, AI role payload, media hub, embedded Sports Center, scanner panel visibility, five timeframe posture cards, HMA overlay/study controls, and all five option premium stop presets.
- The 10% preset is verified to set a $1.1250 stop from a $1.25 premium and recalculate $50 total risk for four standard contracts; 15% is verified at $1.0625 / $75 total risk. The 5%, 7%, and 20% stop preset values are also covered.
- Mobile layout now exposes an in-drawer `×` close button so the Watchlist can be closed without relying on the top navigation or tapping outside the drawer.
- Earlier failures were diagnosed and fixed:
  1. Test expected scanner button visible while its parent details element was collapsed; test now opens the scanner.
  2. Browser script had an accidental duplicated trailing fragment; removed, and JavaScript syntax checks passed.
  3. Mobile scanner test left the off-canvas Watchlist open, then tried to interact behind its overlay. Added an explicit close button and made the test use it before interacting with the chart/option planner.

**Release checkpoint:** PR #10 is merged into `main`. Post-merge browser tests and GitHub Pages deployment succeeded. The newer additive branch above is separate and remains awaiting review.
---

## 2. Current implementation map

### GitHub files changed on the active branch

1. `live-chart-desk/index.html`
   - Adds the AI sidekick role selector.
   - Embeds `media-hub.html` in the Live Desk using iframe `rolMediaHubFrame`.

2. `live-chart-desk/chart-desk.css`
   - Styles the media hub shell and iframe.
   - Desktop iframe height is approximately 1480px; mobile height approximately 1780px. Confirm usability during visual review.

3. `live-chart-desk/media-hub.html` — new
   - Two featured video players: Schwab Network and CBS News.
   - Expandable Real Estate, Weather, Trading Education, and RO’Lyfe Learning channels.
   - Sports Center iframe and standalone/source links.
   - Important: featured YouTube embeds may be replays or featured videos, not guaranteed continuous live streams. Official live-watch links are supplied where available.

4. `js/rol-tools.js`
   - Reads the selected AI role and passes `sidekickMode` with the analysis request.

5. `tests/classroom.spec.js`
   - Adds media structure and AI role request assertions.

6. `.github/workflows/classroom-tests.yml`
   - Includes the active feature branch in push triggers.

### AI role backend

- Supabase project: `ROLyfe-Trading-Intelligence-Classroom`
- Project ID: `ykmdyfbklvuoseqdjnxy`
- Edge Function: `rol-trading-ai`
- Deployed version: **2**
- JWT verification: retained (`verify_jwt: true`)
- Server-side role allowlist and guidance:
  - `coach`: setup, risk, sizing, invalidation, missing evidence, safer alternatives; no trade commands.
  - `analyst`: bullish/bearish/neutral scenarios, timeframe context, catalysts, liquidity, volume, thesis invalidation; separate facts from uncertainty.
  - `professor`: plain-language step-by-step teaching, definitions, examples, and a knowledge-check question.

### Media and Sports destinations

- Sports Center live site: https://rolrichman.github.io/RO-Lyfe-Live-Sports-Center/
- Sports Center repository: https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center
- Sports provider previously reported an account suspension. The embedded page may load while live sports data remains unavailable. Verify provider status separately; do not claim live scores are working unless tested.

---

## 3. Project mission and core trading method

A mobile-first, high-tech trading education classroom built around the RO’Lyfe stock-first method:

1. Study the larger chart structure.
2. Map the setup through 6M/1D → 4H → 1H → 15m → 5m.
3. Define the underlying stock's entry and invalidation before considering an option.
4. Plan risk, targets, exits, and review notes before any real-money decision.
5. Learn and practice using clearly labeled illustrative examples.

The classroom is educational software—not a broker, investment adviser, live signal service, or guarantee of trading results.

## 4. Existing features to preserve

Do not remove or casually replace existing classroom capabilities while working on the Live Desk:

- Market Room and watchlists.
- Chart Intelligence Lab and indicator panels.
- Strategy Advantage tabs.
- Stock-First Trade Planner.
- Classroom lesson modules.
- Local practice journal and JSON export.
- Existing navigation, responsive layout, and trading ecosystem links.
- Existing chart, scanner, timeframe, multi-chart, and market tools in the Live Desk.

The Live Desk and media hub are additions. Preserve existing features unless the user explicitly approves a scoped change.

## 5. Data integrity and known limitations

- Do not describe sample or illustrative data as live market data.
- A video embed is not proof of a continuous live broadcast.
- A Sports Center iframe loading does not prove its upstream live-data provider is operational.
- The AI sidekick is educational/advisory. It must not execute trades or imply autonomous brokerage access.
- Live option-chain premiums, IV, Greeks and open interest depend on the Massive subscription entitlement. The option premium stop presets work from the actual returned or user-entered entry premium; they are calculations only, not live stops or transmitted orders.
- Supabase `rol-trading-ai` currently reports the AI integration as disconnected when `OPENAI_API_KEY` is absent; add the key through Supabase Edge Function Secrets (never commit it). The five-language text translator uses this same AI function and will also remain unavailable until that key is configured.
- Whole-page translation, Chinese (Simplified/Traditional), and a Google Cloud Translation API integration are future work; do not describe them as implemented.
- Never expose API keys or service-role secrets in browser JavaScript.
- Distinguish underlying-stock chart risk from option-premium risk.
- A passing structural browser test does not prove third-party media playback or external API health.

## 6. Verification checklist

### Automated
- [x] Inspect failure artifacts and identify root causes.
- [x] Correct scanner collapsed-state test behavior.
- [x] Repair the chart script syntax and verify JavaScript parsing.
- [x] Correct mobile Watchlist open/close interaction and add a visible drawer close control.
- [x] Pass desktop and mobile Playwright suite on branch head `1d0811f80fc08f64cb8af7e4c5d28edd4bae4559` (push run #122 and pull-request run #123).
### Manual user review
- [ ] User opens the Live Desk and reviews the overall page.
- [ ] Confirm no existing Classroom or Live Desk features disappeared.
- [ ] Confirm media hub scrolls inside its frame without taking over the full Classroom page.
- [ ] Confirm two featured players render and official live links work.
- [ ] Confirm each expandable channel opens and closes.
- [ ] Confirm mute control behavior is clearly understood.
- [ ] Confirm Sports Center iframe loads and report provider/data status honestly.
- [ ] Test Coach, Analyst, and Professor responses and ensure role guidance changes appropriately.
- [ ] Check narrow mobile layout, horizontal overflow, iframe height, and navigation.
- [ ] Check browser console for uncaught errors.

### Release status
**PR #10 is merged and the Pages deployment is successful.** The next visual spot-check should confirm the deployed multi-timeframe posture, HMA visual, option stop cards and mobile drawer close control. Preserve educational-only/no-brokerage disclosures.

---

## 7. How to resume this project

Start with this file, then inspect the live GitHub state rather than assuming the recorded checkpoint is still current.

1. Read this handoff.
2. Check `main` and the merged PR #10 release commit.
3. Check the latest Actions and Pages deployment for the main commit.
4. Inspect the live page on desktop and mobile.
5. For the next feature, create a fresh branch from current `main`.
6. Update this file after every meaningful implementation, test, integration, or deployment change.

## 8. Prior Stage 1 baseline

The earlier Stage 1 Market Room was merged into `main` through PR #1. It included sample watchlists for stocks, crypto, and futures; illustrative chart controls; a stock-first risk worksheet; Playwright setup; and the initial Classroom sections. Its historical test and feature details remain in the repository's commit history and earlier handoff version. Current Live Desk work is a later feature branch and must not be confused with the Stage 1 baseline.

## 9. Handoff operating rules

- Every active RO’Lyfe repository should have a root-level `PROJECT-HANDOFF.md`.
- Update its checkpoint whenever meaningful work is done; record facts, not assumptions.
- Record exact repo, branch, commit, PR, workflow run, deployment, and external dependency identifiers when known.
- Clearly label what is complete, in progress, failed, blocked, and awaiting user review.
- Preserve existing functionality and identify destructive/risky changes before making them.
- Keep secrets out of handoff files.
- The workspace-level index should connect related repositories and identify which integrations are actually implemented versus merely planned.

## 10. Useful links

- [Repository](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom)
- [Live Classroom](https://rolrichman.github.io/RO-Lyfe-Trading-Intelligence-Classroom/)
- [Live Desk pull request #10](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/pull/10)
- [Actions](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions)
- [Sports Center](https://rolrichman.github.io/RO-Lyfe-Live-Sports-Center/)
- [Sports Center repository](https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center)
