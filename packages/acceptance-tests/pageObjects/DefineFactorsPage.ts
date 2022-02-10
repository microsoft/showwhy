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
	addNewFactorButton: dataAttr('add-new-factor-button'),
}

export class DefineFactorsPage extends Page {
	public open(type: string) {
		return super.open(`#/define-factors/${type}`)
	}

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.title, { state: 'visible' })
		await this.page.waitForSelector(selectors.addNewFactorButton, {
			state: 'visible',
		})
	}

	public async goToAddNewFactor(): Promise<void> {
		await this.page.click(selectors.addNewFactorButton)
	}

	public async countElements(): Promise<number> {
		await this.page.waitForSelector(selectors.element, { state: 'visible' })
		return await this.page.locator(selectors.element).count()
	}
}
