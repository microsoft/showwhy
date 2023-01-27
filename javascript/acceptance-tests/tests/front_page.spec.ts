import { expect, test } from '@playwright/test'

const TEST_URL = 'http://localhost:3000'

test.describe('The front page', () => {
	test.beforeEach(async ({ page }, testInfo) => {
		console.log(`Running ${testInfo.title}`)
		await page.goto(TEST_URL)
	})

	test('has has a title', async ({ page }) => {
		await expect(page).toHaveTitle(/ShowWhy Causal Platform/)
	})

	test('can create a new Discovery app by clicking the discovery box', async ({
		page,
	}) => {
		await page.click('#homepage-card-showwhy-discover')
	})

	test('can create a new Events app by clicking the events box', async ({
		page,
	}) => {
		await page.click('#homepage-card-showwhy-events')
	})

	test('can create a new Exposure app by clicking the exposure box', async ({
		page,
	}) => {
		await page.click('#homepage-card-showwhy-model-exposure')
	})
})
