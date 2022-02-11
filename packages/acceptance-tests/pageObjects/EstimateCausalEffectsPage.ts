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
}

export class EstimateCausalEffectsPage extends Page {
	public open() {
		return super.open('#/perform/effects')
	}

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

	public async runEstimate(): Promise<void> {
		await this.page.locator(selectors.runEstimateButton).first().click()
	}

	public async isRunning(): Promise<boolean> {
		return this.page.locator(selectors.progressBar).isVisible()
	}
}
