# RO-Lyfe-Trading-Intelligence-Classroom

**RO’Lyfe Trading Intelligence Classroom™** is a mobile-first, static educational interface for chart study, options strategy comparison, stock-first risk planning, and a local practice journal.

## Files

- `index.html` — classroom layout and sections
- `css/styles.css` — responsive dark classroom styling
- `js/app.js` — illustrative OHLC generator, Heikin-Ashi transformation, moving averages, sample oscillators, strategy comparison, risk worksheet, journal, and question helper
- `assets/` — place optional licensed screenshots and learning images here
- `modules/` — reserved for future modular lessons and strategy modules

## Run locally

Open `index.html` in a modern browser. No build process is required. An internet connection may be used to load the optional Google Fonts; the page remains usable if they are unavailable.

## Deploy with GitHub Pages

1. Upload the contents of this folder to the root of the `RO-Lyfe-Trading-Intelligence-Classroom` repository.
2. Commit to the branch configured for Pages (commonly `main`).
3. In **Settings → Pages**, select the correct branch and `/ (root)` if Pages is not already configured.
4. Open the Pages URL shown by GitHub after deployment completes.

## Chart and indicator notes

The charts use deterministic illustrative OHLC sample data. They are not live market data, and the chart's regenerate button creates another sample sequence. The app calculates:

- Heikin-Ashi candles from sample OHLC bars
- Simple moving averages: 20, 50, 200 periods
- Slow Stochastic-style %K smoothing with 20/80 reference levels
- RSI with 30/70 reference levels
- An illustrative MACD histogram

The displayed MA series are calculated from the sample close series. The chart labels sample values and does not provide market forecasts. VWAP is discussed in the lessons but is not presented as a live/fully calculated indicator in this starter build.

**Important:** Heikin-Ashi open/close values are synthetic calculations. Do not use them as executable prices. Use actual market OHLC/quotes and verify the broker's order ticket when planning real entries and exits.

## Trade planner

The worksheet compares the stock entry and invalidation levels, calculates their distance, and optionally compares a stock target distance to that chart risk. If an option premium is entered, it shows the approximate gross premium debit for standard 100-share equity contracts.

It intentionally does not claim that a stock-chart stop predicts the option's loss. Option value depends on multiple factors, including underlying price, delta, time remaining, implied volatility, liquidity, and bid/ask spread. It does not submit orders or connect to a brokerage.

## Journal and privacy

Journal notes are stored in browser `localStorage` on the current device and browser. They are not synced or backed up. Use **Export journal as JSON** to save a copy. Avoid entering account numbers, passwords, or other sensitive information.

## AI question helper

The floating assistant is a prompt builder. It does not call an AI API or transmit questions. It copies the question to the clipboard when browser permissions allow. A future connected AI integration requires an explicit provider, authentication, server-side secret handling, usage limits, and privacy review. Never place an API secret in client-side JavaScript.

## Next integrations

- Verified live chart/quote provider and documented licensing
- Actual VWAP and optional EMA/SMA selection
- Import of user-approved coach screenshots into `assets/` with captions and rights notes
- Connection back to the RO’Lyfe Tactical Intelligence Center
- Optional server-backed journal, authentication and AI provider
- More rigorous options payoff and expiration calculators

## Educational disclaimer

This is an educational and research aid, not investment advice, a trade signal service, or a brokerage platform. Sample charts are illustrative. Options involve risk and may expire worthless. Stops may execute at worse prices than expected, and stop-limit orders may not execute. Verify all strategy mechanics and broker order behavior before live trading.

## Stage 1 — Market Room (branches: `stage-1-market-room`, `stage-1-market-room-upgrade`)

The Stage 1 Market Room adds a separate practice-data workspace to the classroom:

- `css/market-room.css` — responsive styling for the Market Room.
- `js/market-room.js` — selectable sample watchlists for stocks, crypto and futures; generated illustrative candles; timeframe label controls; a contextual posture panel; and a stock-first 1R/2R/3R risk worksheet.
- The Market Room is linked from the top navigation and hero button in `index.html`.

**Data integrity:** watchlist names and trend labels are educational examples, not current quotes or trade signals. The timeframe selector offers 1m, 5m, 10m, 15m, 30m, 1h, 2h, 4h, 3M/1D, 6M/1D and 1Y/1D study labels. In this sample-data stage, the selector changes the displayed study label only; it does not fetch, aggregate or resample historical bars. Do not interpret a selected timeframe as evidence that timeframe-specific market data is available. No API keys, user accounts, live data, or brokerage connection are configured in this stage.

**Risk worksheet:** for a long plan, stop must be below entry; for a short plan, stop must be above entry. R targets are calculated from entry-to-stop distance multiplied by the selected unit count. Fees, slippage, gaps, futures contract multipliers, and options pricing are not included. Confirm instrument-specific sizing independently.

### Stage 1 validation checklist

- [ ] Open the branch preview and verify Market Room appears in navigation and page flow.
- [ ] Switch Stocks / Crypto / Futures and confirm symbols and chart update.
- [ ] Change each timeframe label and refresh the sample chart; confirm the disclosure that bars remain illustrative sample data.
- [ ] Test long and short risk plans, including invalid stop placement.
- [ ] Check layout on a narrow phone screen and a desktop viewport.
- [ ] Before live data is added, select a licensed provider and implement credentials only on a trusted server-side endpoint.


## Stage 2 — Integrated Market Workstation (review branch)

The `stage-2-integrated-market-workstation` branch adds a separate chart workstation while preserving the original sample-data Market Room and Chart Lab.

- `css/market-workstation.css` — responsive two-column / mobile-stacked chart workstation.
- `js/market-workstation.js` — TradingView embedded stock/ETF and crypto charts, interval controls (1m, 5m, 10m, 15m, 30m, 1h, 2h, 4h, 1D), lookback windows (5 days, 1 month, 3 months, 6 months, 1 year), a broad equity/ETF watchlist, 30 crypto symbols, and a pre-trade checklist.
- Research links group the user's StockCharts market/sector comparisons, Finviz heatmap and screener, economic calendar, CME FedWatch, Yahoo Finance, provider documentation, and the Tactical Intelligence Center.

### Live-chart scope and limitations

The two charts are embedded from TradingView. They are not generated by the classroom's own market-data service. Symbol coverage, available studies, refresh behavior and real-time/delayed quotes depend on TradingView and the relevant exchange entitlements. The default studies request VWAP, RSI and MACD where supported; verify them in the rendered chart. An embedded chart does not mean this site has a licensed API feed, a server-side quote cache, historical-bar aggregation, options chain integration, or brokerage execution.

The selected chart interval and lookback window are separate controls. The 5-day window can be paired with minute intervals; larger windows can be paired with daily candles for 1M/1D, 3M/1D, 6M/1D and 1Y/1D analysis. Chart provider behavior may constrain some interval/range combinations; inspect the displayed chart and timestamp.

### API security and next live-data phase

No Alpha Vantage, Finnhub, MarketData.app, webhook or AI secret is embedded in this branch. Any credentials pasted into chats or committed to client-side code should be treated as exposed and rotated. If we add a server-side data service, store replacement keys as Supabase Edge Function secrets and route browser requests through a validated, rate-limited endpoint. Do not place API keys in HTML, browser JavaScript, URLs, or public repository files.

The next phase for a genuinely integrated data engine is to choose the paid/free data entitlements deliberately, then implement server-side quote and OHLC endpoints, timestamps and stale-data states, provider error/rate-limit handling, timeframe aggregation, indicators calculated from returned bars, and automated mocked/provider-contract tests. Options quotes and Greeks need a separate supported options endpoint and an authorized plan. TradingView embeds alone do not fulfill those backend requirements.

### Premarket discipline

The premarket checklist is educational, not an automated scan or a promise of one trade per day. Low share price does not equal low risk; thin liquidity, spreads, gaps and slippage can overwhelm a setup. Always validate actual volume, spread, news, market context, entry, invalidation and position size. A price above VWAP can support a bullish thesis and below VWAP can support a bearish thesis, but neither guarantees continuous profits; higher and lower timeframes can disagree.
\n## Automated browser checks

The branch includes a Playwright end-to-end suite and a GitHub Actions workflow at `.github/workflows/classroom-tests.yml`. On GitHub, open **Actions → Classroom browser tests** to view run status and detailed failures.

To run the checks locally with Node.js 20 or newer:

```bash
npm install
npx playwright install chromium
npm test
```

The suite covers navigation and section loading, Market Room asset/symbol/timeframe controls, sample-chart rendering, long/short 1R/2R/3R calculations and invalid stop placement, Chart Lab indicator canvases and candle controls, strategy tabs, the stock-first planner, local journal persistence/deletion/JSON export, the AI prompt helper, and mobile viewport overflow/menu behavior. It runs Chromium with desktop and mobile device settings.

A source-level syntax/selector check has been performed. A green GitHub Actions result is still required to confirm the browser-driven suite passes in CI; no test result should be inferred from the presence of the workflow alone.
