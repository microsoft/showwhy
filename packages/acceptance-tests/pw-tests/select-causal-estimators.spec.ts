/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Select Causal Estimators', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.selectCausalEstimatorsPage.open()
		await po.selectCausalEstimatorsPage.waitForLoad()
	})

	test('Click on estimator group', async () => {
		await po.selectCausalEstimatorsPage.clickOnEstimatorGroup()
		const count = await po.selectCausalEstimatorsPage.countSelectedEstimators()
		await expect(count).toEqual(3)
	})

	test('Click on estimators', async () => {
		await po.selectCausalEstimatorsPage.clickOnEstimator()
		await po.selectCausalEstimatorsPage.clickOnEstimator()
		const count = await po.selectCausalEstimatorsPage.countSelectedEstimators()
		await expect(count).toEqual(2)
	})

	test('Change refuter', async () => {
		await po.selectCausalEstimatorsPage.clickOnRefuter()
		const refuter = await po.selectCausalEstimatorsPage.getSelectedRefuter()
		await expect(refuter).toContainText('Full refutation')
	})
})
