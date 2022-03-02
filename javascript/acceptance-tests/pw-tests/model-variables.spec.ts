/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Model Variables', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.modelVariablesPage.open('population')
		await po.header.loadCovidDataset()
		await po.modelVariablesPage.waitForLoad()
	})

	test('Edit Definition', async () => {
		await po.modelVariablesPage.clickOnEdit()
		const last = await (await po.modelVariablesPage.getElements()).last()
		const expected = 'PW edited definition'
		await expect(last).toContainText(expected)
	})

	test('Duplicate Definition', async () => {
		await po.modelVariablesPage.clickOnDuplicate()
		const count = await po.modelVariablesPage.countElements()
		await expect(count).toEqual(2)
	})

	test('Delete Definition', async () => {
		await po.modelVariablesPage.clickOnDelete()
		const count = await po.modelVariablesPage.countElements()
		await expect(count).toEqual(0)
	})

	test('Derive column', async () => {
		await po.modelVariablesPage.deriveNewColumn({
			name: 'PW derived column',
			value: '1',
			filter: '>=',
		})
		const count = await po.modelVariablesPage.countElements()
		await expect(count).toEqual(2)
	})
})
