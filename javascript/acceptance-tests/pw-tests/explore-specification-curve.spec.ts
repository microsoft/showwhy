/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Explore Specification Curve', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.exploreSpecificationCurvePage.open()
		await po.header.uploadZip()
		await po.exploreSpecificationCurvePage.waitForLoad()
	})

	test('Click on graph specification', async () => {
		await po.exploreSpecificationCurvePage.clickOnGraphSpecification()
		const isTextVisible = await po.exploreSpecificationCurvePage.isTextVisible()
		await expect(isTextVisible).toBeTruthy()
		await po.exploreSpecificationCurvePage.clickToggleButton()
		const button = await po.exploreSpecificationCurvePage.getToggleButton()
		await expect(button).toContainText('Accept estimate')
	})
})
