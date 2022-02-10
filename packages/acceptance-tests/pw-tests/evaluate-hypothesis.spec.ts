/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Evaluate Hypothesis', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.evaluateHypothesisPage.open()
		await po.header.uploadZip()
		await po.evaluateHypothesisPage.waitForLoad()
	})

	test('Evaluate hypothesis', async () => {
		await po.evaluateHypothesisPage.clickOnTestButton()
		const isRunning = await po.evaluateHypothesisPage.isRunning()
		await expect(isRunning).toBeTruthy()
	})
})
