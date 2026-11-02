# RO’Lyfe Workspace Index

**Workspace:** RO’Lyfe projects and connected systems  
**Updated:** 2026-11-02  
**Maintained from:** [Trading Intelligence Classroom repository](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom)  
**Purpose:** A central map of RO’Lyfe repositories, deployed applications, backends, and cross-project dependencies. This index points to each project's own `PROJECT-HANDOFF.md`; it does not replace those detailed handoffs.

---

## 1. How to resume work

Use a simple instruction in a new conversation:

> Let's resume from the GitHub handoff for **[project name]**.

Then:
1. Open that repository's `PROJECT-HANDOFF.md`.
2. Verify the current branch, latest commit, open PR, and latest workflow run directly in GitHub.
3. Read the next-step section and any blockers.
4. Continue on the recorded working branch; do not assume the last conversation's status is still current.
5. Update that project's handoff after meaningful changes.

If the project does not yet have a handoff file, create one using the standard structure in Section 5.

## 2. Project directory

| Project | Repository | Live / deployed destination | Known relationship / status |
|---|---|---|---|
| Trading Intelligence Classroom | [RO-Lyfe-Trading-Intelligence-Classroom](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom) | [Live Classroom](https://rolrichman.github.io/RO-Lyfe-Trading-Intelligence-Classroom/) | PR #10 is merged into `main` and its deployment/tests passed. New unmerged branch `feature/live-desk-sector-scanner-timeframes-rewards` adds a Sector Scanner embed, 30m/2h/1w/1mo timeframes, projected stock/option profit summaries, compact scroll controls, Select Language, five true background themes and a wider Sports embed. PR #11 is open and Classroom browser test run #138 passed on 2026-11-02. Awaiting review/merge; not yet on the live site. |
| Auction Capital Machine | [RO-Lyfe-Auction-Capital-Machine](https://github.com/ROLRichman/RO-Lyfe-Auction-Capital-Machine) | [Auction Capital Machine](https://rolrichman.github.io/ro-lyfe-auction-capital-machine/) | Property auction acquisition, due diligence, underwriting, and capital workflow. Treat as a separate project; confirm its own handoff and current branch before editing. |
| Property Research Intelligence | [rolyfe-property-research-intelligence](https://github.com/ROLRichman/rolyfe-property-research-intelligence) | Verify deployed Pages URL in repository | Property research and due diligence workspace. Related to Auction Capital Machine; do not assume code is shared or embedded without checking. |
| Live Sports Center | [RO-Lyfe-Live-Sports-Center](https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center) | [Live Sports Center](https://rolrichman.github.io/RO-Lyfe-Live-Sports-Center/) | Separate sports project. New unmerged branch `feature/sports-mixed-feed-embed-fix` repairs soccer/NFL card auto-load, adds a labeled ESPN multi-league fallback for API-Sports errors/empty responses, expands Market Lab timeframes, adds wider `?embed=classroom` and scanner-only `?embed=market-lab` modes. API-Sports returned 502 in a recent live log; ESPN fallback is public/undocumented and still needs live browser verification. |
| Family Wealth Academy | [Family-Wealth-Academy](https://github.com/ROLRichman/Family-Wealth-Academy) | Verify deployed Pages URL in repository | Family investing education and virtual practice simulator. Keep educational simulator boundaries and no-brokerage claims accurate. |
| Tactical Intelligence Center | [RO-Lyfe-Tactical-Intelligence-Center](https://github.com/ROLRichman/RO-Lyfe-Tactical-Intelligence-Center) | Verify deployed Pages URL in repository | Related RO’Lyfe intelligence/learning project. Confirm actual integrations from source before describing it as connected. |

**Important:** Repository names and URLs above are workspace references. Before editing, confirm each exact repository exists and inspect its latest state. If a link is stale or the repo has a different canonical name, correct this index from GitHub rather than guessing.

## 3. Known backend and service references

### Trading Intelligence Classroom
- Supabase project name: `ROLyfe-Trading-Intelligence-Classroom`
- Supabase project ID: `ykmdyfbklvuoseqdjnxy`
- Edge Function: `rol-trading-ai`
- Edge Function `rol-trading-ai`: deployed v2; JWT verification retained.
- Edge Function `market-data`: deployed v29; includes Tickerbot OHLCV and scanner paths plus quote/options provider routes.
- `OPENAI_API_KEY` was not present when the AI function was checked; AI analysis and text translation remain disconnected until configured through Supabase Edge Function Secrets.
- Never put secrets, API keys, or service-role credentials in this file or browser code.

### Sports Center

- Supabase project ID: `nzduinxmsmmdbonefifi`
- Primary Edge Functions: `sports-live-scores` and `sports-nfl-scores`.
- A recent soccer request reached `sports-live-scores` and returned HTTP 502 from the function. This is an upstream/provider issue rather than a broken card anchor.
- The new branch adds a primary-then-fallback workflow. The ESPN public scoreboard endpoints are undocumented; their long-term stability and browser availability are not guaranteed.
- The standalone scanner embed reuses the existing Sector Scanner and the Trading Classroom Live Desk points to that same page. It does not duplicate sector scanning code.
- Separate GitHub repository and GitHub Pages deployment (links above).
- Previously configured sports API provider reported account suspension. Confirm provider dashboard/status and function logs before claiming live scores or fixtures are available.

### Cross-project embed confirmed at this checkpoint
- The Trading Intelligence Classroom's `main` branch embeds the separately deployed Live Sports Center inside `live-chart-desk/media-hub.html`.
- This is a web embed, not a shared codebase or proof of shared backend/data.
- The Trading Classroom Live Desk is the host; the Sports Center remains independently deployed.

### Related property workflow
- Auction Capital Machine and Property Research Intelligence are related in purpose.
- Confirm current links, API calls, shared data, Supabase dependencies, and actual iframe/navigation relationships from each repository before changing either project. Do not infer integration solely from similar branding or project goals.

## 4. Active workspace checkpoint — 2026-11-02

### Trading Intelligence Classroom
- Release branch: `main`
- Merged PR: [#10 — RTIC Live Desk: Media Hub, Sports embed & AI Co-Pilot](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/pull/10)
- Merge commit: `5edde8e2c9a2c4d058d51543db6b5cdc490f03df`
- Post-merge browser test run [#128](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41519829942): **PASSED**.
- GitHub Pages deployment run [#81](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41519829081): **PASSED**.
- User reviewed the Live Desk layout and authorized merge. Multi-timeframe posture/HMA, option stop presets, and mobile drawer close refinements are included in the deployed main release.
- AI and text translation still require `OPENAI_API_KEY` in Supabase Edge Function Secrets. Whole-page Google translation and Chinese support remain future work.
- Preserve all existing classroom functionality and the education/no-brokerage boundaries.
- Full details: [PROJECT-HANDOFF.md](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/blob/feature/live-desk-timeframes-quotes-snapshot/PROJECT-HANDOFF.md).
## 5. Standard per-repository handoff requirements

Every active RO’Lyfe repository should maintain a root-level `PROJECT-HANDOFF.md` with:

1. **Project identity:** purpose, repository URL, live deployment URL, owner/maintainer context if appropriate.
2. **Current checkpoint:** date, default branch, active branch, latest commit, open PRs.
3. **Status:** complete / in progress / failed / blocked / awaiting user review.
4. **Recent changes:** files changed and what changed.
5. **Tests and verification:** exact workflow run, results, failures, artifacts, and manual checks still needed.
6. **Integrations:** Supabase project IDs, Edge Function names, APIs, external services, deployed apps, iframe links, and whether each connection is implemented, planned, or unverified. Never include secrets.
7. **Preservation rules:** features, files, calculations, data, or behavior that must not be removed or overwritten.
8. **Known limitations:** provider outages, sample data, missing credentials, rate limits, unverified behavior.
9. **Next actions:** numbered, ordered steps that can be executed without reconstructing prior conversations.
10. **Useful links:** repository, deployment, PR, Actions, backend dashboards/docs as appropriate.

## 6. Update discipline

Update the relevant project's handoff whenever any of the following happens:
- A feature is added, removed, or materially changed.
- A branch, PR, commit, merge, or deployment changes.
- A test passes or fails.
- An API, Supabase function, secret name, provider, iframe, or external integration changes.
- A blocker is discovered or resolved.
- The user changes requirements or approves a design decision.

For multi-repository work:
- Update each affected repository's own handoff.
- Update this workspace index if project relationships, deployment destinations, or cross-project integrations change.
- Do not claim a repository was updated unless its file was actually committed.
- Keep the handoff factual and concise enough to use as the first stop in the next conversation.

## 7. Safety and preservation rules

- Work on a feature branch unless the user explicitly authorizes a different workflow.
- Inspect the existing project before replacing files.
- Preserve working features and existing backups.
- Never merge a failed or unreviewed change just to clear a task.
- Do not publish credentials, tokens, private keys, personal data, or secret values in repository documentation.
- Clearly distinguish a page that loads from an integration that actually works.
