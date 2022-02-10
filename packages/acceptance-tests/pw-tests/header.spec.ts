/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { test, expect, Page } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageObjects'

test.describe('Header', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.header.open()
		await po.header.waitForLoad()
	})

	test('Load COVID-19 Dataset', async () => {
		await po.header.loadCovidDataset()
		const question = await po.header.getQuestion()
		const expected =
			'For Confirmed COVID-19 Cases, does Chronic Disease cause Mortality Risk to Increase?'
		await expect(question).toHaveText(expected)
	})

	test('Load Smoking Cessation Dataset', async () => {
		await po.header.loadSmokingCessationDataset()
		const question = await po.header.getQuestion()
		const expected =
			'For Cigarette Smokers, does Smoking Reduction cause Body Weight Change (kg) to Increase?'
		await expect(question).toHaveText(expected)
	})

	test('Upload Project from .zip', async () => {
		await po.header.uploadZip()
		const question = await po.header.getQuestion()
		const expected =
			'For Confirmed COVID-19 Cases, does Chronic Disease cause Mortality Risk to Increase?'
		await expect(question).toHaveText(expected)
	})

	test('Download Project', async () => {
		await po.header.loadCovidDataset()
		await po.header.getQuestion()
		const download = await po.header.downloadProject()
		await expect(download).not.toBe(null)
	})
})
