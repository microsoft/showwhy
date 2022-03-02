/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Locator } from '@playwright/test'
import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	table: dataAttr('table'),
	row: dataAttr('generic-table-row'),
	definitionSteps: dataAttr('definition-steps'),
	definitionList: dataAttr('definition-list'),
	deriveColumn: dataAttr('derive-column-button'),
	delete: dataAttr('delete-button'),
	duplicate: dataAttr('duplicate-button'),
	edit: dataAttr('edit-button'),
	save: dataAttr('save-button'),
	deriveColumnForm: dataAttr('derive-column-form'),
	deriveColumnFormName: dataAttr('derive-column-form-name'),
	deriveColumnFormColumn: dataAttr('derive-column-form-column'),
	deriveColumnFormFilter: dataAttr('derive-column-form-filter'),
	deriveColumnFormValue: dataAttr('derive-column-form-value'),
	deriveColumnFormApply: dataAttr('derive-column-form-apply'),
	dropdownOptionButton: 'button[role="option"]',
}

interface Field {
	name: string
	column?: string
	filter?: string
	value: string
}

export class ModelVariablesPage extends Page {
	public open(type: string) {
		return super.open(`#/prepare/variables/${type}`)
	}

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.table, { state: 'visible' })
		await this.page.waitForSelector(selectors.definitionList, {
			state: 'visible',
		})
		await this.page.waitForSelector(selectors.definitionSteps, {
			state: 'visible',
		})
	}

	public async getElements(): Promise<Locator> {
		return this.page.locator(selectors.row)
	}

	public async countElements(): Promise<number> {
		return (await this.getElements()).count()
	}

	public async clickOnDuplicate(): Promise<void> {
		const elements = await this.countElements()
		if (elements > 0) {
			await (await this.getElements())
				.first()
				.locator(selectors.duplicate)
				.click()
		}
	}

	public async clickOnDelete(): Promise<void> {
		const elements = await this.countElements()
		if (elements > 0) {
			await (await this.getElements()).first().locator(selectors.delete).click()
		}
	}

	public async clickOnEdit(): Promise<void> {
		const elements = await this.countElements()
		if (elements > 0) {
			const last = `${selectors.row}:nth-child(${elements})`
			await Promise.all([
				await this.page.locator(`${last} ${selectors.edit}`).click(),
				await this.page.fill(`${last} input`, 'PW edited definition'),
				await this.page.locator(`${last} ${selectors.save}`).click(),
			])
		}
	}

	public async deriveNewColumn(data: Field): Promise<void> {
		const { name, column, filter, value } = data
		await this.page.locator(selectors.deriveColumn).click()
		await this.page.waitForSelector(selectors.deriveColumnForm, {
			state: 'visible',
		})

		await this.page.fill(selectors.deriveColumnFormName, name)
		await this.page.fill(selectors.deriveColumnFormValue, value)

		await this.page.locator(selectors.deriveColumnFormColumn).click()
		await this.page.waitForSelector(selectors.dropdownOptionButton, {
			state: 'visible',
		})
		if (column) {
			await this.page
				.locator(`${selectors.dropdownOptionButton}:has-text('${column}')`)
				.click()
		} else {
			await this.page.locator(selectors.dropdownOptionButton).first().click()
		}

		await this.page.locator(selectors.deriveColumnFormFilter).click()
		await this.page.waitForSelector(selectors.dropdownOptionButton, {
			state: 'visible',
		})
		if (filter) {
			await this.page
				.locator(`${selectors.dropdownOptionButton}:has-text('${filter}')`)
				.click()
		} else {
			await this.page.locator(selectors.dropdownOptionButton).first().click()
		}

		await this.page.locator(selectors.deriveColumnFormApply).click()
	}
}
