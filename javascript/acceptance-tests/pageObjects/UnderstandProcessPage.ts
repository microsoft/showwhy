/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	title: dataAttr('title'),
	resourceLink: dataAttr('resource-link'),
}

export class UnderstandProcessPage extends Page {
	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.title, { state: 'visible' })
	}

	public async getTitle(): Promise<string> {
		return this.page.locator(selectors.title).innerText()
	}

	public async countResourceLinks(): Promise<number> {
		await this.page.waitForSelector(selectors.resourceLink, {
			state: 'visible',
		})
		return this.page.locator(selectors.resourceLink).count()
	}
}
