import { expect, type Page, test } from '@playwright/test';

async function openApp(page: Page): Promise<string[]> {
  const consoleErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    consoleErrors.push(error.message);
  });

  await page.goto('/');
  return consoleErrors;
}

test('loads the dashboard and lazy routes', async ({ page }) => {
  const consoleErrors = await openApp(page);

  await expect(page.getByRole('heading', { name: /welcome to performance dashboard/i })).toBeVisible();
  await expect(page.getByText('Angular 22', { exact: true })).toBeVisible();

  await page.getByRole('link', { name: /products/i }).click();
  await expect(page.getByRole('heading', { name: /product catalog/i })).toBeVisible();
  await expect(page.getByText(/100 products/i)).toBeVisible();

  await page.getByRole('link', { name: /analytics/i }).click();
  await expect(page.getByRole('heading', { name: /analytics dashboard/i })).toBeVisible();

  await page.getByRole('link', { name: /orders/i }).click();
  await expect(page.getByRole('heading', { name: /orders management/i })).toBeVisible();

  await page.getByRole('link', { name: /settings/i }).click();
  await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();

  expect(consoleErrors).toEqual([]);
});

test('filters the product catalog', async ({ page }) => {
  const consoleErrors = await openApp(page);

  await page.getByRole('link', { name: /products/i }).click();
  await expect(page.getByText(/100 products/i)).toBeVisible();

  await page.getByPlaceholder('Search products...').fill('Product 10');
  await expect(page.getByText(/2 products/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Product 10', exact: true })).toBeVisible();

  await page.getByPlaceholder('Search products...').fill('Product 1');
  await page.locator('.category-select').selectOption('Books');
  await expect(page.locator('.product-card').first()).toBeVisible();
  await expect(page.locator('.product-category').first()).toHaveText('Books');

  expect(consoleErrors).toEqual([]);
});
