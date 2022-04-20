/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { expect, Page, test } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Consider Variable Relationships Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.considerVariableRelationshipsPage.open()
		await po.considerVariableRelationshipsPage.waitForLoad()
	})

	test('Add factors causing exposure and outcome', async () => {
		await po.considerVariableRelationshipsPage.goToAddNewFactor()
		await po.considerRelevantVariablesPage.addElement({
			variable: 'Primary variable',
		})
		await po.considerRelevantVariablesPage.addElement({
			variable: 'Secondary variable',
		})
		await po.considerRelevantVariablesPage.goToBackToPage()
		await po.considerVariableRelationshipsPage.selectCauses(0, {
			causeExposure: 'No',
			causeOutcome: 'Moderately',
		})
		await po.considerVariableRelationshipsPage.selectCauses(1, {
			causeExposure: 'Weakly',
			causeOutcome: 'Strongly',
		})
		const elements = await po.considerVariableRelationshipsPage.countElements()
		await expect(elements).toEqual(2)
	})
})
