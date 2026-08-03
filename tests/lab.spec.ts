import { test, expect, type Page } from '@playwright/test'

const BASE = 'http://localhost:3000'

// Helper: wait for the lab data to load (loading skeleton disappears)
async function waitForLabLoaded(page: Page) {
  await expect(page.locator('h1')).toContainText('Reverse-Engineering Lab', { timeout: 15000 })
  await page.waitForTimeout(800)
}

// Helper: click a nav button by text and verify the target section scrolls into view
async function clickNavAndVerifySection(page: Page, navText: string, sectionId: string) {
  const navBtn = page.locator('nav button', { hasText: navText }).first()
  await navBtn.click()
  await page.waitForTimeout(1000)
  const section = page.locator(`#${sectionId}`)
  await expect(section).toBeInViewport({ ratio: 0.1 })
}

test.describe('Chongoyape Bizcochuelos Lab — full functional validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLabLoaded(page)
  })

  test('preamble: page loads with hero, title, and status cards', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Reverse-Engineering Lab')
    await expect(page.getByText('Claims corroborated', { exact: true })).toBeVisible()
    await expect(page.getByText('Validation rounds passed', { exact: true })).toBeVisible()
    await expect(page.locator('header').getByText('Convergence', { exact: true })).toBeVisible()
    await expect(page.locator('img[alt*="Bizcochuelos Valera"]').first()).toBeVisible()
  })

  test('executive summary renders 5 key findings', async ({ page }) => {
    await expect(page.getByText('Executive Summary').first()).toBeVisible()
    await expect(page.getByText('5 key findings')).toBeVisible()
    await expect(page.getByText('Key contradiction')).toBeVisible()
    await expect(page.getByText('Core formula').first()).toBeVisible()
    await expect(page.getByText('Producer confirmed')).toBeVisible()
    await expect(page.getByText('Validation status')).toBeVisible()
    // "Convergence" appears multiple times; scope to the executive summary section
    const execSection = page.locator('section').filter({ hasText: 'Executive Summary' }).first()
    await expect(execSection.getByText('Convergence')).toBeVisible()
  })

  test('lab stats band shows 6 animated counters', async ({ page }) => {
    await expect(page.getByText('Claims audited')).toBeVisible()
    await expect(page.getByText('Ingredients', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Techniques', { exact: true })).toBeVisible()
    await expect(page.getByText('Recipe variants')).toBeVisible()
    await expect(page.getByText('Validation rounds')).toBeVisible()
    await expect(page.getByText('Complexity removed')).toBeVisible()
  })

  test('protocol flow shows 5 steps', async ({ page }) => {
    await expect(page.getByText('The governing sequence')).toBeVisible()
    await expect(page.getByText('Define failure tests')).toBeVisible()
    await expect(page.getByText('Build minimal solution')).toBeVisible()
    await expect(page.getByText('Remove complexity')).toBeVisible()
    await expect(page.getByText('Test against evidence')).toBeVisible()
    await expect(page.getByText('Two quiet rounds')).toBeVisible()
  })

  test('nav: clicking "07 · Recipe Lab" scrolls to recipe lab section', async ({ page }) => {
    await clickNavAndVerifySection(page, '07 · Recipe Lab', 'recipe-lab')
    await expect(page.getByText('Recipe Lab — Four-Level Hierarchy')).toBeVisible()
  })

  test('nav: clicking "11 · Verdict" scrolls to verdict section', async ({ page }) => {
    await clickNavAndVerifySection(page, '11 · Verdict', 'verdict')
    await expect(page.getByText('Final Challenge & Parsimony Verdict')).toBeVisible()
  })

  test('nav: clicking "01 · Memory Audit" scrolls to research rounds', async ({ page }) => {
    await clickNavAndVerifySection(page, '01 · Memory Audit', 'memory')
    await expect(page.getByText('Pre-Research Protocol')).toBeVisible()
  })

  test('research rounds: first accordion shows findings', async ({ page }) => {
    await page.locator('#memory').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await expect(page.getByText('Findings').first()).toBeVisible()
    await expect(page.getByText('Strengthened').first()).toBeVisible()
    await expect(page.getByText('Contradictions').first()).toBeVisible()
  })

  test('evidence console: tabs switch between Visual / Contradictions / Sources', async ({ page }) => {
    await page.locator('#evidence').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    // Click the Contradictions tab
    await page.getByRole('tab', { name: /Contradictions/ }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText('Contradiction & disconfirmation ledger')).toBeVisible()
    // Click the Sources tab
    await page.getByRole('tab', { name: /Sources/ }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText('RPP Noticias')).toBeVisible()
    // Click back to Visual
    await page.getByRole('tab', { name: /Visual/ }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText('Observed characteristics')).toBeVisible()
  })

  test('claims ledger: category filter chips work', async ({ page }) => {
    await page.locator('#claims').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    // Click the "historical" filter chip
    await page.getByRole('button', { name: 'historical' }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText(/\/ 15/)).toBeVisible()
    // Click "all" to reset
    await page.getByRole('button', { name: 'all' }).click()
    await page.waitForTimeout(300)
  })

  test('claims donut chart renders with sectors', async ({ page }) => {
    await page.locator('#claims').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    const pieSectors = page.locator('.recharts-pie-sector')
    await expect(pieSectors.first()).toBeVisible()
    const count = await pieSectors.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('ingredient ledger: expand first ingredient and see details', async ({ page }) => {
    await page.locator('#ingredients').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    const firstTrigger = page.locator('[id^="radix-accordion-trigger-"]').first()
    const isExpanded = await firstTrigger.getAttribute('data-state')
    if (isExpanded === 'closed') {
      await firstTrigger.click()
      await page.waitForTimeout(500)
    }
    await expect(page.getByText('Function').first()).toBeVisible()
    await expect(page.getByText('Evidence').first()).toBeVisible()
  })

  test('recipe lab: clicking a diagnostic variant updates the detail panel', async ({ page }) => {
    await page.locator('#recipe-lab').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    const diagB = page.getByRole('button', { name: /Diagnostic B.*Separated-Egg/ })
    await diagB.click()
    await page.waitForTimeout(500)
    await expect(page.getByText('Does separated-egg method yield higher volume')).toBeVisible()
  })

  test('recipe scaler: slider changes the gram values', async ({ page }) => {
    await page.locator('#recipe-lab').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    const slider = page.locator('[role="slider"]').first()
    await expect(slider).toBeVisible()
    const beforeValue = await slider.getAttribute('aria-valuenow')
    expect(beforeValue).toBe('6')
    await slider.click()
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('ArrowRight')
    }
    await page.waitForTimeout(300)
    const afterValue = await slider.getAttribute('aria-valuenow')
    expect(afterValue).toBe('12')
  })

  test('recipe comparison: toggle compare mode and select variants', async ({ page }) => {
    await page.locator('#recipe-lab').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'Compare' }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText(/Select variants/)).toBeVisible()
    const checkboxes = page.locator('[role="checkbox"]')
    const count = await checkboxes.count()
    expect(count).toBeGreaterThan(0)
    await checkboxes.first().click()
    await page.waitForTimeout(300)
    await checkboxes.nth(1).click()
    await page.waitForTimeout(500)
    // Comparison table should show total batter
    await expect(page.getByText('Total batter').first()).toBeVisible()
  })

  test('recipe sandbox: toggling a modification updates the formula', async ({ page }) => {
    await page.locator('#recipe-lab').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    await expect(page.getByText('What-If Recipe Sandbox')).toBeVisible()
    const switches = page.locator('[role="switch"]')
    const switchCount = await switches.count()
    expect(switchCount).toBeGreaterThan(0)
    await switches.first().click()
    await page.waitForTimeout(500)
    await expect(page.getByText('Predicted effects')).toBeVisible()
  })

  test('baker\'s quick reference: print button is present', async ({ page }) => {
    await page.getByText("Baker's Quick Reference").scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await expect(page.getByText("Baker's Quick Reference")).toBeVisible()
    await expect(page.getByRole('button', { name: 'Print card' })).toBeVisible()
    await expect(page.getByText('Whole eggs (room temp)')).toBeVisible()
  })

  test('failure risk matrix: filter buttons work', async ({ page }) => {
    await page.locator('#failures').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await expect(page.getByText('Failure-Test Risk Matrix')).toBeVisible()
    await page.getByRole('button', { name: 'critical' }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText('Insufficient rise')).toBeVisible()
    await expect(page.getByText('Collapse after baking')).toBeVisible()
  })

  test('validation radar chart renders', async ({ page }) => {
    await page.locator('#validation').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    const radar = page.locator('.recharts-radar-polygon')
    await expect(radar).toBeVisible()
  })

  test('theme toggle: switches between light and dark mode', async ({ page }) => {
    const toggle = page.locator('button[aria-label*="Switch to"]')
    await expect(toggle).toBeVisible()
    const htmlClass = await page.locator('html').getAttribute('class')
    const isDark = htmlClass?.includes('dark') ?? false
    await toggle.click()
    await page.waitForTimeout(500)
    const newHtmlClass = await page.locator('html').getAttribute('class')
    const newIsDark = newHtmlClass?.includes('dark') ?? false
    expect(newIsDark).toBe(!isDark)
  })

  test('command palette (Cmd+K): opens and shows searchable options', async ({ page }) => {
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(500)
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
    const input = dialog.locator('input')
    await input.fill('chuño')
    await page.waitForTimeout(500)
    await expect(page.getByText(/Chuño/).first()).toBeVisible()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  })

  test('glossary floating button: opens glossary dialog', async ({ page }) => {
    const glossaryBtn = page.locator('button[aria-label="Open glossary"]')
    await expect(glossaryBtn).toBeVisible()
    await glossaryBtn.click()
    await page.waitForTimeout(500)
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
    // Glossary terms should be visible in the dialog
    await expect(dialog.getByText('punto cinta').first()).toBeVisible()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  })

  test('back-to-top button appears after scrolling and works', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 3000))
    await page.waitForTimeout(800)
    const backToTop = page.locator('button[aria-label="Back to top"]')
    await expect(backToTop).toBeVisible()
    await backToTop.click()
    await page.waitForTimeout(1000)
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeLessThan(100)
  })

  test('executive summary: quick nav links scroll to sections', async ({ page }) => {
    // Find the "Jump to" links within the executive summary section
    const execSection = page.locator('section').filter({ hasText: 'Executive Summary' }).first()
    const recipeLink = execSection.getByRole('link', { name: 'Recipe' })
    await recipeLink.click()
    await page.waitForTimeout(1000)
    await expect(page.locator('#recipe-lab')).toBeInViewport({ ratio: 0.1 })
  })

  test('footer is present at the bottom with 3 columns', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    const footer = page.locator('footer')
    await expect(footer.getByText('Chongoyape Bizcochuelos Lab')).toBeVisible()
    await expect(footer.getByText('Honesty & limits')).toBeVisible()
    await expect(footer.getByText('Sources')).toBeVisible()
    await expect(footer.getByText('Back to top')).toBeVisible()
  })

  test('section dividers are present between sections', async ({ page }) => {
    const dividers = page.locator('[aria-hidden="true"]')
    const count = await dividers.count()
    expect(count).toBeGreaterThan(5)
  })

  test('no runtime errors in console', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => {
      if (!err.message.includes('hydrat') && !err.message.includes('theme')) {
        errors.push(err.message)
      }
    })
    await page.goto(BASE)
    await waitForLabLoaded(page)
    await page.evaluate(() => window.scrollTo(0, 5000))
    await page.waitForTimeout(500)
    await page.evaluate(() => window.scrollTo(0, 10000))
    await page.waitForTimeout(500)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    expect(errors).toEqual([])
  })
})
