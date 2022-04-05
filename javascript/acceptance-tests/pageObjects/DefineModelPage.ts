/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from './Page'
import { dataAttr } from '../util'
import { capitalize } from 'lodash'

const selectors: Record<string, string> = {
	title: dataAttr('title'),
	form: dataAttr('factors-form'),
	definitionElement: dataAttr('definition-element'),
	variableField: dataAttr('factors-form-variable-name'),
	isPrimaryCheckbox: `${dataAttr('factors-form-is-primary')} input`,
	description: dataAttr('factors-form-description'),
	type: dataAttr('factors-form-type'),
	addButton: dataAttr('factors-form-add-button'),
}

const typeSelector = (type: string) =>
	`.ms-Dropdown-items button[role="option"]:has-text("${capitalize(type)}")`

interface Field {
	isPrimary?: boolean
	variable: string
	description?: string
	type: string
}

export class DefineModelPage extends Page {
	protected PAGE_PATH: string = '#/define/alternative'

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.title, { state: 'visible' })
		await this.page.waitForSelector(selectors.form, { state: 'visible' })
	}

	public async addElement(data: Field): Promise<void> {
		const { isPrimary, variable, description, type } = data

		if (isPrimary) {
			await this.page.click(selectors.isPrimaryCheckbox)
		}

		if (type) {
			await this.page.click(selectors.type)
			await this.page.locator(typeSelector(type)).click()
		}

		if (variable) {
			await this.page.fill(selectors.variableField, variable)
		}

		if (description) {
			await this.page.fill(selectors.description, description)
		}

		await this.page.click(selectors.addButton)
	}

	public async countElements(): Promise<number> {
		await this.page.waitForSelector(selectors.definitionElement, {
			state: 'visible',
		})
		return this.page.locator(selectors.definitionElement).count()
	}
}
