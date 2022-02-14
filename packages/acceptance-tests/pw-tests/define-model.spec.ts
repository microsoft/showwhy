/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Define Model Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
	})

	test('Define population', async () => {
		await po.defineModelPage.open('population')
		await po.defineModelPage.waitForLoad()
		await po.defineModelPage.addElement({ variable: 'Primary variable' })
		await po.defineModelPage.addElement({ variable: 'Secondary variable' })
		const elements = await po.defineModelPage.countElements()
		await expect(elements).toEqual(2)
	})

	test('Define exposure', async () => {
		await po.defineModelPage.open('exposure')
		await po.defineModelPage.waitForLoad()
		await po.defineModelPage.addElement({ variable: 'Primary variable' })
		await po.defineModelPage.addElement({ variable: 'Secondary variable' })
		const elements = await po.defineModelPage.countElements()
		await expect(elements).toEqual(2)
	})

	test('Define outcome', async () => {
		await po.defineModelPage.open('outcome')
		await po.defineModelPage.waitForLoad()
		await po.defineModelPage.addElement({ variable: 'Primary variable' })
		await po.defineModelPage.addElement({ variable: 'Secondary variable' })
		const elements = await po.defineModelPage.countElements()
		await expect(elements).toEqual(2)
	})
})
