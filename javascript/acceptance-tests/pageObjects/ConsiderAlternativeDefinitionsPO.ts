/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from './Page'
import { dataAttr } from '../util'
import { capitalize } from 'lodash'

const selectors: Record<string, string> = {
	title: dataAttr('title'),
	form: dataAttr('definitions-form'),
	definitionElement: dataAttr('definition-element'),
	variableField: dataAttr('definitions-form-variable-name'),
	isPrimaryCheckbox: `${dataAttr('definitions-form-is-primary')} input`,
	description: dataAttr('definitions-form-description'),
	addButton: dataAttr('definitions-form-add-button'),
}

const tabSelector = (type: string) =>
	`button[role="tab"]:has-text("${capitalize(type)}")`

interface Field {
	isPrimary?: boolean
	variable: string
	description?: string
	type: string
}

export class ConsiderAlternativeDefinitionsPO extends Page {
	protected PAGE_PATH: string = '#/model/alternative'

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.title, { state: 'visible' })
		await this.page.waitForSelector(selectors.form, { state: 'visible' })
	}

	public async addElement(data: Field): Promise<void> {
		const { isPrimary, variable, description, type } = data

		await this.page.locator(tabSelector(type)).click()

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
