/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Understand Process Pages', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
	})

	test('Why ShowWhy', async () => {
		await po.understandProcessPage.open()
		await po.understandProcessPage.waitForLoad()
		const title = await po.understandProcessPage.getTitle()
		const links = await po.understandProcessPage.countResourceLinks()
		const expected = 'Learn more about key concepts​'
		await expect(title).toEqual(expected)
		await expect(links > 0).toBeTruthy()
	})

	test('Who ShowWhy', async () => {
		await po.understandProcessPage.open('#/understand/who')
		await po.understandProcessPage.waitForLoad()
		const title = await po.understandProcessPage.getTitle()
		const links = await po.understandProcessPage.countResourceLinks()
		const expected = 'Learn more about key concepts​'
		await expect(title).toEqual(expected)
		await expect(links > 0).toBeTruthy()
	})

	test('When ShowWhy', async () => {
		await po.understandProcessPage.open('#/understand/when')
		await po.understandProcessPage.waitForLoad()
		const title = await po.understandProcessPage.getTitle()
		const links = await po.understandProcessPage.countResourceLinks()
		const expected = 'Learn more about key concepts​'
		await expect(title).toEqual(expected)
		await expect(links > 0).toBeTruthy()
	})

	test('How ShowWhy', async () => {
		await po.understandProcessPage.open('#/understand/how')
		await po.understandProcessPage.waitForLoad()
		const title = await po.understandProcessPage.getTitle()
		const links = await po.understandProcessPage.countResourceLinks()
		const expected = 'Learn more about key concepts​'
		await expect(title).toEqual(expected)
		await expect(links > 0).toBeTruthy()
	})
})
