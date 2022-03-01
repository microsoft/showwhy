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
		test.setTimeout(60000)
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.evaluateHypothesisPage.open()
		await po.header.uploadZip()
		await po.evaluateHypothesisPage.waitForLoad()
	})

	test('Renders content', async () => {
		test.setTimeout(60000)
		const isVisible = await po.evaluateHypothesisPage.contentIsVisible()
		await expect(isVisible).toBeTruthy()
	})

	// TODO: uncomment when there's backend support for running significance tests of projects loaded from zip
	// test('Evaluate hypothesis', async () => {
	// 	test.setTimeout(45000)
	// 	await po.evaluateHypothesisPage.clickOnTestButton()
	// 	const isRunning = await po.evaluateHypothesisPage.isRunning()
	// 	await expect(isRunning).toBeTruthy()
	// })
})
