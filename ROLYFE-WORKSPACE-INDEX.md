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
| Trading Intelligence Classroom | [RO-Lyfe-Trading-Intelligence-Classroom](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom) | [Live Classroom](https://rolrichman.github.io/RO-Lyfe-Trading-Intelligence-Classroom/) | Active trading education hub. Live Desk media/AI, multi-timeframe posture, HMA, mobile Watchlist close control, and option premium risk presets are on the active feature branch in open PR #10; code-level desktop/mobile Playwright passed on the tested implementation commit. Verify documentation-only follow-up checks before merge. |
| Auction Capital Machine | [RO-Lyfe-Auction-Capital-Machine](https://github.com/ROLRichman/RO-Lyfe-Auction-Capital-Machine) | [Auction Capital Machine](https://rolrichman.github.io/ro-lyfe-auction-capital-machine/) | Property auction acquisition, due diligence, underwriting, and capital workflow. Treat as a separate project; confirm its own handoff and current branch before editing. |
| Property Research Intelligence | [rolyfe-property-research-intelligence](https://github.com/ROLRichman/rolyfe-property-research-intelligence) | Verify deployed Pages URL in repository | Property research and due diligence workspace. Related to Auction Capital Machine; do not assume code is shared or embedded without checking. |
| Live Sports Center | [RO-Lyfe-Live-Sports-Center](https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center) | [Live Sports Center](https://rolrichman.github.io/RO-Lyfe-Live-Sports-Center/) | Separate sports project. Embedded inside the Trading Intelligence Classroom Live Desk media hub on the active PR branch. Upstream sports provider previously reported suspended; iframe loading does not prove live data works. |
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
- Separate GitHub repository and GitHub Pages deployment (links above).
- Previously configured sports API provider reported account suspension. Confirm provider dashboard/status and function logs before claiming live scores or fixtures are available.

### Cross-project embed confirmed at this checkpoint
- The Trading Intelligence Classroom's active feature branch adds an iframe to the Live Sports Center inside `live-chart-desk/media-hub.html`.
- This is a web embed, not a shared codebase or proof of shared backend/data.
- The Trading Classroom Live Desk is the host; the Sports Center remains independently deployed.

### Related property workflow
- Auction Capital Machine and Property Research Intelligence are related in purpose.
- Confirm current links, API calls, shared data, Supabase dependencies, and actual iframe/navigation relationships from each repository before changing either project. Do not infer integration solely from similar branding or project goals.

## 4. Active workspace checkpoint — 2026-11-02

### Trading Intelligence Classroom
- Branch: `feature/live-desk-timeframes-quotes-snapshot`
- PR: [#10 — RTIC Live Desk: Media Hub, Sports embed & AI Co-Pilot](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/pull/10)
- Latest tested code commit: `1d0811f80fc08f64cb8af7e4c5d28edd4bae4559`
- Code verification: push run [#122](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41519211343) and pull-request run [#123](https://github.com/ROLRichman/RO-Lyfe-Trading-Intelligence-Classroom/actions/runs/41519225902) both **PASSED** on that commit.
- Handoff update commit: `0f2f81dbb591094604f59c3ca42eb41e6b038f5e`. Documentation-only push/PR runs were triggered for this latest branch head and must be checked before merge.
- User has reviewed and liked the Live Desk page layout and approved commits/merge. Multi-timeframe posture/HMA, option stop, and the in-drawer mobile close refinements were added after the first page review and are covered by the passing desktop/mobile suite.
- AI and text translation still require `OPENAI_API_KEY` in Supabase Edge Function Secrets. Whole-page Google translation and Chinese support remain future work.
- PR #10 is open and not merged. Preserve all existing classroom functionality and the education/no-brokerage boundaries.
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
