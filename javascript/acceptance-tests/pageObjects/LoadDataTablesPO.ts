/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Locator } from '@playwright/test'
import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	dropzone: `${dataAttr('dropzone')} section`,
	selectedDataset: dataAttr('selected-card'),
	table: dataAttr('table'),
}

export class LoadDataTablesPO extends Page {
	protected PAGE_PATH: string = '#/prepare/load'

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.dropzone, { state: 'visible' })
	}

	public async getSelectedDataset(): Promise<Locator> {
		return this.page.locator(selectors.selectedDataset)
	}

	public async getTable(): Promise<Locator> {
		await this.page.waitForSelector(selectors.table, { state: 'visible' })
		return this.page.locator(selectors.table)
	}
}
