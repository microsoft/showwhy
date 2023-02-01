import { expect, test } from '@playwright/test'
import config from 'config'

const TEST_URL = config.get<string>('test.target_url')

test('has title', async ({ page }) => {
	await page.goto(TEST_URL)
	await expect(page).toHaveTitle(/ShowWhy Causal Platform/)
})
