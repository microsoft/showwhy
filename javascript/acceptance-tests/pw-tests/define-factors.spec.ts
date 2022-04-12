/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Define Factors Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.defineFactorsPage.open()
		await po.defineFactorsPage.waitForLoad()
	})

	test('Add factors causing exposure and outcome', async () => {
		await po.defineFactorsPage.goToAddNewFactor()
		await po.modelCausalFactorsPage.addElement({ variable: 'Primary variable' })
		await po.modelCausalFactorsPage.addElement({
			variable: 'Secondary variable',
		})
		await po.modelCausalFactorsPage.goToBackToPage()
		await po.defineFactorsPage.selectCauses(0, {
			causeExposure: 'No',
			causeOutcome: 'Moderately',
		})
		await po.defineFactorsPage.selectCauses(1, {
			causeExposure: 'Weakly',
			causeOutcome: 'Strongly',
		})
		const elements = await po.defineFactorsPage.countElements()
		await expect(elements).toEqual(2)
	})
})
