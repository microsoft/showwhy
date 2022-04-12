/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Locator } from '@playwright/test'
import { Page } from './Page'
import { dataAttr } from '../util'

type fn = (n?: number) => string

const selectors: Record<string, string> = {
	graph: dataAttr('specification-curve'),
	toggleEstimateButton: dataAttr('toggle-estimate-button'),
	text: dataAttr('selected-specification-text'),
}

const specificationSelector: fn = (n = 72) => `path:nth-child(${n})`

export class EstimateCausalEffectPO extends Page {
	protected PAGE_PATH: string = '#/perform/causal-effects'

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.graph, { state: 'visible' })
	}

	public async clickOnGraphSpecification(
		specification?: number,
	): Promise<void> {
		await this.page
			.locator(specificationSelector(specification))
			.first()
			.click()
	}

	public async isTextVisible(): Promise<boolean> {
		return this.page.locator(selectors.text).isVisible()
	}

	public async clickToggleButton(): Promise<void> {
		return this.page.locator(selectors.toggleEstimateButton).click()
	}

	public async getToggleButton(): Promise<Locator> {
		return this.page.locator(selectors.toggleEstimateButton)
	}
}
