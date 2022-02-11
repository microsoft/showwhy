/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	content: dataAttr('evaluate-hypothesis-content'),
	progressBar: dataAttr('progress-bar'),
	runTestButton: dataAttr('run-significance-test-button'),
}

export class EvaluateHypothesisPage extends Page {
	protected PAGE_PATH: string = '#/perform/evaluate'

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.content, { state: 'visible' })
	}

	public async clickOnTestButton(): Promise<void> {
		await this.page.locator(selectors.runTestButton).first().click()
	}

	public async isRunning(): Promise<boolean> {
		await this.page.waitForSelector(selectors.progressBar, { state: 'visible' })
		return this.page.locator(selectors.progressBar).isVisible()
	}
}
