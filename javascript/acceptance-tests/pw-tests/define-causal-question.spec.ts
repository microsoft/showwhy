/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'
import { generateFieldData } from '../util'

test.describe('Define Causal Question Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.defineCausalQuestion.open()
		await po.defineCausalQuestion.waitForLoad()
	})

	test('Describe all elements', async () => {
		await po.defineCausalQuestion.enterFieldGroupData(
			generateFieldData('Population'),
		)
		await po.defineCausalQuestion.enterFieldGroupData(
			generateFieldData('Exposure'),
		)
		await po.defineCausalQuestion.enterFieldGroupData(
			generateFieldData('Outcome'),
		)
		await po.defineCausalQuestion.selectHypothesis('Increase')
		const expected =
			'For Population label, does Exposure label cause Outcome label to Increase?'
		const question = await po.header.getQuestion()
		expect(question).toHaveText(expected)
	})
})
