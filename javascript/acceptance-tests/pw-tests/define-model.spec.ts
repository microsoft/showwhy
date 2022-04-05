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
		await po.defineModelPage.open()
		await po.defineModelPage.waitForLoad()
	})

	test('Define population', async () => {
		await po.defineModelPage.addElement({
			variable: 'Primary variable',
			type: 'population',
		})
		await po.defineModelPage.addElement({
			variable: 'Secondary variable',
			type: 'population',
		})
		const elements = await po.defineModelPage.countElements()
		await expect(elements).toEqual(2)
	})

	test('Define exposure', async () => {
		await po.defineModelPage.addElement({
			variable: 'Primary variable',
			type: 'exposure',
		})
		await po.defineModelPage.addElement({
			variable: 'Secondary variable',
			type: 'exposure',
		})
		const elements = await po.defineModelPage.countElements()
		await expect(elements).toEqual(4)
	})

	test('Define outcome', async () => {
		await po.defineModelPage.addElement({
			variable: 'Primary variable',
			type: 'outcome',
		})
		await po.defineModelPage.addElement({
			variable: 'Secondary variable',
			type: 'outcome',
		})
		const elements = await po.defineModelPage.countElements()
		await expect(elements).toEqual(6)
	})
})
