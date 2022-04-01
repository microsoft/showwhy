/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Model Causal Factors Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.ModelDomainPage.open()
		await po.ModelDomainPage.waitForLoad()
	})

	test('Add causal factors', async () => {
		await po.ModelDomainPage.addElement({ variable: 'Primary variable' })
		await po.ModelDomainPage.addElement({
			variable: 'Secondary variable',
		})
		const elements = await po.ModelDomainPage.countElements()
		await expect(elements).toEqual(2)
	})
})
