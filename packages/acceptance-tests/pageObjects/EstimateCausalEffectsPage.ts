/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Locator } from '@playwright/test'
import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	table: dataAttr('available-estimates-table'),
	run: dataAttr('run'),
	progressBar: dataAttr('progress-bar'),
	runEstimateButton: dataAttr('run-estimate-button'),
	populationSpec: dataAttr('specification-population'),
	exposureSpec: dataAttr('specification-exposure'),
	outcomeSpec: dataAttr('specification-outcome'),
	causalModelsSpec: dataAttr('specification-causal-models'),
	estimatorsSpec: dataAttr('specification-estimators'),
}

export class EstimateCausalEffectsPage extends Page {
	protected PAGE_PATH: string = '#/perform/effects'

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.table, { state: 'visible' })
		await this.page.waitForSelector(selectors.runEstimateButton, {
			state: 'visible',
		})
	}

	public async getRun(): Promise<Locator> {
		return this.page.locator(selectors.run)
	}

	public async countRuns(): Promise<number> {
		await this.page.waitForSelector(selectors.run, { state: 'visible' })
		return (await this.getRun()).count()
	}

	public async getPopulationSpec(): Promise<Locator> {
		return this.page.locator(selectors.populationSpec)
	}

	public async getOutcomeSpec(): Promise<Locator> {
		return this.page.locator(selectors.outcomeSpec)
	}

	public async getExposureSpec(): Promise<Locator> {
		return this.page.locator(selectors.exposureSpec)
	}

	public async getCausalModelsSpec(): Promise<Locator> {
		return this.page.locator(selectors.causalModelsSpec)
	}

	public async getEstimatorsSpec(): Promise<Locator> {
		return this.page.locator(selectors.estimatorsSpec)
	}
}
