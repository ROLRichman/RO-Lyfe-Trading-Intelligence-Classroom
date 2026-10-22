const { test, expect } = require('@playwright/test');

test('classroom loads with working navigation and core sections', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#market-room')).toBeVisible();
  await expect(page.locator('#chart-lab')).toBeAttached();
  await expect(page.locator('#strategy')).toBeAttached();
  await expect(page.locator('#trade-planner')).toBeAttached();
  await expect(page.locator('#classroom')).toBeAttached();
  await expect(page.locator('#journal')).toBeAttached();
  await page.getByRole('link', { name: /Market Room/ }).first().click();
  await expect(page).toHaveURL(/#market-room$/);
  await expect(page.locator('#mrChart')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('Market Room switches asset class, symbols, timeframe and refreshes chart', async ({ page }) => {
  await page.goto('/');
  const title = page.locator('#mrChartTitle');
  await expect(title).toContainText('AAPL');
  await page.locator('#mrAssetClass').selectOption('crypto');
  await expect(page.locator('#mrSymbolList button')).toHaveCount(5);
  await expect(title).toContainText('BTC-USD');
  await page.locator('#mrSymbolList button').filter({ hasText: 'ETH-USD' }).click();
  await expect(title).toContainText('ETH-USD');
  await page.locator('#mrAssetClass').selectOption('futures');
  await expect(title).toContainText('ES');
  await page.locator('#mrTimeframe').selectOption('15m');
  await expect(page.locator('#mrTimeframeTag')).toHaveText('15m');
  await page.locator('#mrRefresh').click();
  await expect(page.locator('#mrChartNote')).toContainText('no live feed');
  const canvasSize = await page.locator('#mrChart').evaluate(canvas => ({ width: canvas.width, height: canvas.height }));
  expect(canvasSize.width).toBeGreaterThan(0);
  expect(canvasSize.height).toBeGreaterThan(0);
});

test('Market Room risk ladder validates stop placement and calculates long and short R targets', async ({ page }) => {
  await page.goto('/');
  await page.locator('#mrEntry').fill('100');
  await page.locator('#mrStop').fill('98');
  await page.locator('#mrShares').fill('10');
  await page.locator('#mrRiskForm button[type="submit"]').click();
  await expect(page.locator('#mrRiskOutput')).toContainText('$20.00');
  await expect(page.locator('#mrRiskOutput')).toContainText('$102.00');
  await expect(page.locator('#mrRiskOutput')).toContainText('$104.00');
  await expect(page.locator('#mrRiskOutput')).toContainText('$106.00');
  await page.locator('#mrStop').fill('101');
  await expect(page.locator('#mrRiskOutput')).toContainText('long plan needs the stop below entry');
  await page.locator('#mrDirection').selectOption('short');
  await page.locator('#mrStop').fill('102');
  await expect(page.locator('#mrRiskOutput')).toContainText('$20.00');
  await expect(page.locator('#mrRiskOutput')).toContainText('$98.00');
  await expect(page.locator('#mrRiskOutput')).toContainText('$94.00');
});

test('Chart Lab renders study panels and responds to symbol and candle controls', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#trendRead')).not.toHaveText('Loading study…');
  for (const id of ['priceChart', 'stochChart', 'rsiChart', 'macdChart']) {
    const size = await page.locator('#' + id).evaluate(canvas => ({ width: canvas.width, height: canvas.height }));
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  }
  await page.locator('#chartSymbol').selectOption('BEAR');
  await expect(page.locator('#lastClose')).toContainText('(sample)');
  await page.locator('#candleMode').selectOption('regular');
  await expect(page.locator('#modeRead')).toHaveText('Regular candles');
  await page.locator('#timeframe').selectOption('15m');
  await page.locator('#refreshChart').click();
});

test('strategy comparison tabs update the active strategy', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Covered calls' }).click();
  await expect(page.locator('#strategyDetail h3')).toHaveText('Covered calls');
  await expect(page.getByRole('tab', { name: 'Covered calls' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: 'Vertical spread' }).click();
  await expect(page.locator('#strategyDetail h3')).toHaveText('Vertical spread');
});

test('stock-first planner calculates risk and flags direction conflicts', async ({ page }) => {
  await page.goto('/');
  await page.locator('#underlying').fill('TEST');
  await page.locator('#direction').selectOption('Bullish');
  await page.locator('#entry').fill('100');
  await page.locator('#invalidation').fill('98');
  await page.locator('#target').fill('106');
  await page.locator('#premium').fill('1.25');
  await page.locator('#contracts').fill('1');
  await page.locator('#maxLoss').fill('100');
  await page.locator('#plannerForm button[type="submit"]').click();
  await expect(page.locator('#planOutput')).toContainText('$2.00');
  await expect(page.locator('#planOutput')).toContainText('3.00R');
  await expect(page.locator('#planOutput')).toContainText('$125.00');
  await expect(page.locator('#planOutput')).toContainText('exceeds the entered risk budget');
  await page.locator('#invalidation').fill('102');
  await page.locator('#plannerForm button[type="submit"]').click();
  await expect(page.locator('#planOutput')).toContainText('levels may conflict');
});

test('journal saves locally, survives reload, deletes entries and exports JSON', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#journalSymbol').fill('AAPL practice');
  await page.locator('#journalNote').fill('Waited for structure; followed risk plan.');
  await page.locator('#journalForm button[type="submit"]').click();
  await expect(page.locator('#journalEntries')).toContainText('AAPL practice');
  await page.reload();
  await expect(page.locator('#journalEntries')).toContainText('AAPL practice');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportJournal').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('rolyfe-trading-journal.json');
  await page.locator('.delete-note').first().click();
  await expect(page.locator('#journalEntries')).not.toContainText('AAPL practice');
});

test('AI helper is clearly a prompt builder and opens/closes', async ({ page }) => {
  await page.goto('/');
  await page.locator('#aiFab').click();
  await expect(page.locator('#aiPanel')).toBeVisible();
  await page.locator('#aiQuestion').fill('Explain risk per share');
  await page.locator('#clearPrompt').click();
  await expect(page.locator('#aiStatus')).toContainText('Question cleared');
  await page.locator('#aiClose').click();
  await expect(page.locator('#aiPanel')).toBeHidden();
});

test('mobile layout has no horizontal page overflow and menu closes after navigation', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile viewport check runs in the mobile project');
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth
  }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1);
  await page.locator('#menuToggle').click();
  await expect(page.locator('#mainNav')).toHaveClass(/open/);
  await page.locator('#mainNav a[href="#market-room"]').click();
  await expect(page.locator('#mainNav')).not.toHaveClass(/open/);
});
