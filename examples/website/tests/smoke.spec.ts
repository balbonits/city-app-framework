import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});

test('all sections render', async ({ page }) => {
  await page.goto('/');
  for (const id of ['top', 'problem', 'solution', 'rules', 'design-system', 'showcase', 'get-started']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test('design system shows tokens and primitives', async ({ page }) => {
  await page.goto('/#design-system');
  await expect(page.getByRole('heading', { name: 'The rules, made visible.' })).toBeVisible();
  await expect(page.getByText('Color tokens', { exact: true })).toBeVisible();
  await expect(page.getByText('Buttons (all five states)')).toBeVisible();
  await expect(page.getByText('Inputs (all five states)')).toBeVisible();
});

test('showcase has both dashboards', async ({ page }) => {
  await page.goto('/#showcase');
  await expect(page.getByRole('heading', { name: /Vibe-coded vs/ })).toBeVisible();
  await expect(page.getByText('Vibe-coded', { exact: true })).toBeVisible();
  await expect(page.getByText('Rules-applied', { exact: true })).toBeVisible();
});

test('hero product preview is present', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel("Excerpt from the framework's AGENTS.md file")).toBeVisible();
});

for (const theme of ['dark', 'light'] as const) {
  test(`screenshots — ${theme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/');
    await page.evaluate((t) => localStorage.setItem('theme', t), theme);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `tests/screenshots/${theme}-hero.png` });
    await page.locator('#solution').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `tests/screenshots/${theme}-solution.png` });
    await page.locator('#design-system').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `tests/screenshots/${theme}-design-system.png` });
    await page.locator('#showcase').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `tests/screenshots/${theme}-showcase.png` });
    await page.locator('#rules').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `tests/screenshots/${theme}-rules.png` });
    await page.locator('#get-started').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `tests/screenshots/${theme}-get-started.png` });
  });
}
