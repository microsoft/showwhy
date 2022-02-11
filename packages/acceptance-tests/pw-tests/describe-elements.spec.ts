/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'
import { generateFieldData } from '../util'

test.describe('Describe Elements Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.describeElementsPage.open()
		await po.describeElementsPage.waitForLoad()
	})

	test.only('Describe all elements', async () => {
		await po.describeElementsPage.enterFieldGroupData(
			generateFieldData('Population'),
		)
		await po.describeElementsPage.enterFieldGroupData(
			generateFieldData('Exposure'),
		)
		await po.describeElementsPage.enterFieldGroupData(
			generateFieldData('Outcome'),
		)
		await po.describeElementsPage.selectHypothesis('Change')

		//await page.screenshot({ path: './shot.png' })
		const expected =
			'For Population label, does Exposure label cause Outcome label to Change?'
		const question = await po.header.getQuestion()
		expect(question).toHaveText(expected)
	})
})
