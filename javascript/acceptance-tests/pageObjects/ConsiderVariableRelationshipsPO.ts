/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { dataAttr } from '../util'
import { Page } from './Page'

interface CausesDropdown {
	causeExposure: string
	causeOutcome: string
}

const selectors: Record<string, string> = {
	title: dataAttr('title'),
	form: dataAttr('factors-form'),
	row: '.ms-DetailsRow',
	addNewFactorButton: dataAttr('add-new-factor-button'),
}

const causesDropdownSelector = (type: string, index: number) =>
	`${dataAttr(`factor-${index}`)} ${dataAttr(type)}`
const optionSelector = (type: string) =>
	`button[role="option"]:has-text("${type}")`

export class ConsiderVariableRelationshipsPO extends Page {
	protected PAGE_PATH: string = `#/model/variable-relationships`

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.title, { state: 'visible' })
		await this.page.waitForSelector(selectors.addNewFactorButton, {
			state: 'visible',
		})
	}

	public async selectCauses(index = 0, data: CausesDropdown): Promise<void> {
		const { causeExposure, causeOutcome } = data
		await this.page.click(causesDropdownSelector('causeExposure', index))
		await this.page.click(optionSelector(causeExposure))
		await this.page.click(causesDropdownSelector('causeOutcome', index))
		await this.page.click(optionSelector(causeOutcome))
	}

	public async goToAddNewFactor(): Promise<void> {
		return this.page.click(selectors.addNewFactorButton)
	}

	public async countElements(): Promise<number> {
		await this.page.waitForSelector(selectors.row, { state: 'visible' })
		return this.page.locator(selectors.row).count()
	}
}
