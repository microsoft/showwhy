/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	title: dataAttr('title'),
	form: dataAttr('factors-form'),
	definitionElement: dataAttr('definition-element'),
	variableField: `${dataAttr('factors-form-variable-name')} input`,
	isPrimaryCheckbox: `${dataAttr('factors-form-is-primary')} input`,
	description: dataAttr('factors-form-description'),
	addButton: dataAttr('factors-form-add-button'),
}

interface Field {
	isPrimary?: boolean
	variable: string
	description?: string
}

export class DefineModelPage extends Page {
	public open(type: string) {
		return super.open(`#/define/${type.toLowerCase()}`)
	}

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.title, { state: 'visible' })
		await this.page.waitForSelector(selectors.form, { state: 'visible' })
	}

	public async addElement(data: Field): Promise<void> {
		const { isPrimary, variable, description } = data

		if (isPrimary) {
			await this.page.click(selectors.isPrimaryCheckbox)
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
