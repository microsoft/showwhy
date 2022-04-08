/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Locator } from '@playwright/test'
import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	estimator: `${dataAttr('estimator')} i`,
	refuter: `${dataAttr('refuter-count')} input`,
	selectedEstimator: dataAttr('selected-estimator'),
	estimatorGroupSelector: dataAttr('estimator-group-selector'),
}

export class SelectCausalEstimatorsPage extends Page {
	protected PAGE_PATH: string = '#/perform/estimators'

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.estimatorGroupSelector, {
			state: 'visible',
		})
		await this.page.waitForSelector(selectors.refuter, { state: 'visible' })
		await this.page.waitForSelector(selectors.estimator, { state: 'visible' })
	}

	public async getSelectedEstimators(): Promise<Locator> {
		return this.page.locator(selectors.selectedEstimator)
	}
	public async getRefuterCount(): Promise<Locator> {
		return this.page.locator(selectors.refuter)
	}

	public async countSelectedEstimators(): Promise<number> {
		await this.page.waitForSelector(selectors.estimator, { state: 'visible' })
		return (await this.getSelectedEstimators()).count()
	}

	public async clickOnEstimatorGroup(): Promise<void> {
		await this.page.locator(selectors.estimatorGroupSelector).first().click()
	}

	public async clickOnEstimator(): Promise<void> {
		await this.page.locator(selectors.estimator).first().click()
	}

	public async fillRefuter(value: string): Promise<void> {
		await this.page.fill(selectors.refuter, value)
	}
}
