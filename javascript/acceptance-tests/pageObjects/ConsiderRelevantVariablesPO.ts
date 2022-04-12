/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	title: dataAttr('title'),
	form: dataAttr('factors-form'),
	element: dataAttr('generic-table-row'),
	variableField: dataAttr('factors-form-variable-name'),
	description: dataAttr('factors-form-description'),
	addButton: dataAttr('factors-form-add-button'),
	goBackButton: dataAttr('go-back-button'),
}

interface Field {
	variable: string
	description?: string
}

export class ConsiderRelevantVariablesPO extends Page {
	protected PAGE_PATH: string = `#/model/relevant-variables`

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.title, { state: 'visible' })
		await this.page.waitForSelector(selectors.form, { state: 'visible' })
	}

	public async addElement(data: Field): Promise<void> {
		const { variable, description } = data

		if (variable) {
			await this.page.fill(selectors.variableField, variable)
		}

		if (description) {
			await this.page.fill(selectors.description, description)
		}

		await this.page.click(selectors.addButton)
	}

	public async countElements(): Promise<number> {
		await this.page.waitForSelector(selectors.element, { state: 'visible' })
		return this.page.locator(selectors.element).count()
	}

	public async goToBackToPage(): Promise<void> {
		await this.page.click(selectors.goBackButton)
	}
}
