# RO’Lyfe Trading Intelligence Classroom — Project Handoff

**Repository:** [ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom)  
**Live site:** https://rolrichman.github.io/RO-Lyfe-Trading-Intelligence-Classroom/  
**Handoff updated:** 2026-11-02  
**Default branch:** `main`  
**Active work branch:** `feature/live-desk-timeframes-quotes-snapshot`  
**Active pull request:** [#10 — RTIC Live Desk: Media Hub, Sports embed & AI Co-Pilot](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/pull/10)  
**Latest known PR head:** `1f3aa859fcf4e5551a27c6c627420af063d0b672`  
**Merge status:** NOT MERGED. Keep PR #10 in draft until failures are diagnosed, the user reviews the rendered page, and required checks pass.

---

## 1. Current checkpoint — read this first

### Live Desk media + AI sidekick upgrade

The active feature branch adds the following work:

- Two featured media players in the Live Desk.
- Expandable channels for Real Estate Intelligence, Weather Intelligence, Trading Education, and RO’Lyfe Learning Network.
- Embedded RO’Lyfe Live Sports Center inside the Live Desk media hub.
- Mute control for the embedded YouTube players (it changes player mute parameters and reloads the players; it is not a native instant mixer).
- Three AI sidekick roles: Trading Coach, Market Analyst, and Professor Mode.
- Server-side role guidance in the Supabase `rol-trading-ai` Edge Function, deployed as version 2 with JWT verification retained.
- Playwright assertions for the media hub, Sports embed, role selector, and role request payload.

### User review state

**The user has not yet reviewed the rendered Live Desk page.** Do not treat the implementation as visually approved. Next manual review should happen on the deployed preview/branch page if available, or after the PR branch is published to a reviewable environment.

### Automated test state — FAILED

- Workflow: **Classroom browser tests**
- Run: [GitHub Actions run #41506319432](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41506319432)
- Branch: `feature/live-desk-timeframes-quotes-snapshot`
- Tested commit: `1f3aa859fcf4e5551a27c6c627420af063d0b672`
- Job: `playwright`
- Failed step: **Run desktop and mobile browser tests**
- Setup, checkout, Node setup, dependency installation, Chromium installation, and artifact upload succeeded.
- Failure artifact exists: `playwright-test-results` (artifact ID `13170698350`; expires 2027-01-31).
- Exact failing assertion/error has NOT yet been extracted. Do not guess the cause or mark tests as passed.

**Required next action:** inspect the Playwright failure artifact / test report, identify the failing test and error, fix the cause on this branch, and rerun the suite. Then manually review desktop and phone layouts, embedded video behavior, Sports iframe loading, and all three AI roles. Do not merge until checks pass and the user has reviewed the page.

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
- Never expose API keys or service-role secrets in browser JavaScript.
- Distinguish underlying-stock chart risk from option-premium risk.
- A passing structural browser test does not prove third-party media playback or external API health.

## 6. Verification checklist

### Automated
- [ ] Inspect failure artifact for run #41506319432.
- [ ] Identify exact failing test, assertion, and browser viewport.
- [ ] Fix the underlying defect; do not weaken tests just to make CI green.
- [ ] Rerun desktop and mobile Playwright suite.
- [ ] Confirm all required PR checks pass on the latest commit.

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

### Release gate
**Do not merge PR #10 until automated checks pass, manual review is complete, and the user approves.**

---

## 7. How to resume this project

Start with this file, then inspect the live GitHub state rather than assuming the recorded checkpoint is still current.

1. Read this handoff.
2. Check PR #10 and its latest head commit.
3. Check the latest Actions run for that exact commit.
4. Inspect the failed artifact/report before editing.
5. Continue on `feature/live-desk-timeframes-quotes-snapshot`.
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
