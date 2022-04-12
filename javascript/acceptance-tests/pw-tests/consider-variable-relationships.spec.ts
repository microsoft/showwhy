/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Consider Variable Relationships Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.considerVariableRelationships.open()
		await po.considerVariableRelationships.waitForLoad()
	})

	test('Add factors causing exposure and outcome', async () => {
		await po.considerVariableRelationships.goToAddNewFactor()
		await po.considerRelevantVariables.addElement({
			variable: 'Primary variable',
		})
		await po.considerRelevantVariables.addElement({
			variable: 'Secondary variable',
		})
		await po.considerRelevantVariables.goToBackToPage()
		await po.considerVariableRelationships.selectCauses(0, {
			causeExposure: 'No',
			causeOutcome: 'Moderately',
		})
		await po.considerVariableRelationships.selectCauses(1, {
			causeExposure: 'Weakly',
			causeOutcome: 'Strongly',
		})
		const elements = await po.considerVariableRelationships.countElements()
		await expect(elements).toEqual(2)
	})
})
