/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Consider Alternative Definitions Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.considerAlternativeDefinitions.open()
		await po.considerAlternativeDefinitions.waitForLoad()
	})

	test('Define population', async () => {
		await po.considerAlternativeDefinitions.addElement({
			variable: 'Primary variable',
			type: 'population',
		})
		await po.considerAlternativeDefinitions.addElement({
			variable: 'Secondary variable',
			type: 'population',
		})
		const elements = await po.considerAlternativeDefinitions.countElements()
		await expect(elements).toEqual(2)
	})

	test('Define exposure', async () => {
		await po.considerAlternativeDefinitions.addElement({
			variable: 'Primary variable',
			type: 'exposure',
		})
		await po.considerAlternativeDefinitions.addElement({
			variable: 'Secondary variable',
			type: 'exposure',
		})
		const elements = await po.considerAlternativeDefinitions.countElements()
		await expect(elements).toEqual(2)
	})

	test('Define outcome', async () => {
		await po.considerAlternativeDefinitions.addElement({
			variable: 'Primary variable',
			type: 'outcome',
		})
		await po.considerAlternativeDefinitions.addElement({
			variable: 'Secondary variable',
			type: 'outcome',
		})
		const elements = await po.considerAlternativeDefinitions.countElements()
		await expect(elements).toEqual(2)
	})
})
