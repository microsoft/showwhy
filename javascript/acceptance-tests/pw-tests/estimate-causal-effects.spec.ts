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
		// await po.estimateCausalEffectsPage.open()
		// await po.header.uploadZip()
		// await po.estimateCausalEffectsPage.waitForLoad()
	})

	test.skip('Count current runs', async () => {
		const count = await po.estimateCausalEffectsPage.countRuns()
		await expect(count).toEqual(1)
	})

	test.skip('Load specifications', async () => {
		const population = await po.estimateCausalEffectsPage.getPopulationSpec()
		const exposure = await po.estimateCausalEffectsPage.getExposureSpec()
		const outcome = await po.estimateCausalEffectsPage.getOutcomeSpec()
		const causalModels =
			await po.estimateCausalEffectsPage.getCausalModelsSpec()
		const estimators = await po.estimateCausalEffectsPage.getEstimatorsSpec()
		await expect(population).toContainText('1 population definition')
		await expect(exposure).toContainText('2 exposure definitions')
		await expect(outcome).toContainText('1 outcome definition')
		await expect(causalModels).toContainText('3 causal models')
		await expect(estimators).toContainText('5 estimator configurations')
	})
})
