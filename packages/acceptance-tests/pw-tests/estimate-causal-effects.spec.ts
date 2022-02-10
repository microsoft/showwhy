/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Estimate Causal Effects', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.estimateCausalEffectsPage.open()
		await po.header.uploadZip()
		await po.estimateCausalEffectsPage.waitForLoad()
	})

	test('Count current runs', async () => {
		const count = await po.estimateCausalEffectsPage.countRuns()
		await expect(count).toEqual(2)
	})

	test('Click on run estimate', async () => {
		await po.estimateCausalEffectsPage.runEstimate()
		const isRunning = await po.estimateCausalEffectsPage.isRunning()
		await expect(isRunning).toBeTruthy()
	})
})
