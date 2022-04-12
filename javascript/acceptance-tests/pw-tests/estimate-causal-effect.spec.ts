/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Estimate Causal Effect Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.estimateCausalEffect.open()
		await po.header.uploadZip()
		await po.estimateCausalEffect.waitForLoad()
	})

	test('Click on graph specification', async () => {
		await po.estimateCausalEffect.clickOnGraphSpecification()
		const isTextVisible = await po.estimateCausalEffect.isTextVisible()
		await expect(isTextVisible).toBeTruthy()
		await po.estimateCausalEffect.clickToggleButton()
		const button = await po.estimateCausalEffect.getToggleButton()
		await expect(button).toContainText('Accept estimate')
	})
})
