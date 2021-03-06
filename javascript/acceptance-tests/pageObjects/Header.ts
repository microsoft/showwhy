/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Locator } from '@playwright/test'
import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	title: dataAttr('main-title'),
	load: dataAttr('load'),
	save: dataAttr('save'),
	question: dataAttr('question'),
	upload: dataAttr('uploadZip'),
	covid: dataAttr('COVID-19'),
	smoking: dataAttr('SmokingCessation'),
	saveProject: dataAttr('save-project'),
	understandQuestion: dataAttr('understand-question'),
	understandQuestionButton: dataAttr('understand-question-button'),
	understandQuestionTitle: dataAttr('understand-question-title'),
	resourceLink: dataAttr('resource-link'),
}

export class Header extends Page {
	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.title, { state: 'visible' })
		await this.page.waitForSelector(selectors.load, { state: 'visible' })
		await this.page.waitForSelector(selectors.question, { state: 'visible' })
		await this.page.waitForSelector(selectors.understandQuestion, {
			state: 'visible',
		})
	}

	private async openLoadMenu(selector: string): Promise<void> {
		await this.page.click(selectors.load)
		await this.page.waitForSelector(selector, { state: 'visible' })
	}

	private async openSaveMenu(selector: string): Promise<void> {
		await this.page.waitForTimeout(1000)
		await this.page.click(selectors.save)
		await this.page.waitForSelector(selector, { state: 'visible' })
	}

	private async openQuestionModal(selector: string): Promise<void> {
		await this.page.waitForTimeout(1000)
		await this.page.click(selectors.understandQuestion)
		await this.page.waitForSelector(selector, { state: 'visible' })
	}

	public async uploadZip(fileName = 'COVID-19'): Promise<void> {
		await this.openLoadMenu(selectors.upload)
		const [fileChooser] = await Promise.all([
			this.page.waitForEvent('filechooser'),
			this.page.locator(selectors.upload).click(),
		])
		await fileChooser.setFiles(`./files/${fileName}.zip`)
	}

	public async loadCovidDataset(): Promise<void> {
		await this.openLoadMenu(selectors.covid)
		this.page.locator(selectors.covid).click()
	}

	public async loadSmokingCessationDataset(): Promise<void> {
		await this.openLoadMenu(selectors.smoking)
		this.page.locator(selectors.smoking).click()
	}

	public async downloadProject(): Promise<string | null> {
		await this.openSaveMenu(selectors.saveProject)
		const [download] = await Promise.all([
			this.page.waitForEvent('download'),
			this.page.locator(selectors.saveProject).click(),
		])
		return download.path()
	}

	public async getQuestion(): Promise<Locator> {
		await this.page.waitForTimeout(1000)
		return this.page.locator(selectors.question)
	}

	public async understandQuestion(): Promise<void> {
		await this.openQuestionModal(selectors.understandQuestionTitle)
	}

	public async countResourceLinks(): Promise<number> {
		await this.page.waitForSelector(selectors.resourceLink, {
			state: 'visible',
		})
		return this.page.locator(selectors.resourceLink).count()
	}
}
