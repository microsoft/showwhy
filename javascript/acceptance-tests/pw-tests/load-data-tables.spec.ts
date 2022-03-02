/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Load Data Tables', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.loadDataTablesPage.open()
		await po.loadDataTablesPage.waitForLoad()
	})

	test('Load COVID-19 Dataset from Dropzone', async () => {
		await po.header.loadCovidDataset()
		const dataset = await po.loadDataTablesPage.getSelectedDataset()
		const expected = 'covid19_small_data.csv'
		await expect(dataset).toContainText(expected)
	})
})
