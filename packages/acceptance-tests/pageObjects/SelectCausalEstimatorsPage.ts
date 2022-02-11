/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Locator } from '@playwright/test'
import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	estimator: `${dataAttr('estimator')} i`,
	refuter: dataAttr('refuter'),
	selectedEstimator: dataAttr('selected-estimator'),
	selectedRefuter: dataAttr('selected-refuter'),
	estimatorGroupSelector: dataAttr('estimator-group-selector'),
}

export class SelectCausalEstimatorsPage extends Page {
	public open() {
		return super.open('#/perform/estimators')
	}

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

	public async getSelectedRefuter(): Promise<Locator> {
		return this.page.locator(selectors.selectedRefuter)
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

	public async clickOnRefuter(): Promise<void> {
		return this.page.locator(selectors.refuter).first().click()
	}
}
