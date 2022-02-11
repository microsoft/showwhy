/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page as PWPage } from '@playwright/test'
import config from 'config'

const selectors: Record<string, string> = {
	spinners: '.waitSpinner',
	body: 'body',
}

export abstract class Page {
	public constructor(private _page: PWPage) {}

	protected PAGE_PATH: string = ''

	protected get page() {
		return this._page
	}

	protected get rootUrl() {
		return config.get('url')
	}

	protected async waitForLoad() {
		await this.page.waitForSelector(selectors.body)
		await this.page.waitForSelector(selectors.spinners, { state: 'detached' })
	}

	protected async open(path = this.PAGE_PATH): Promise<void> {
		this.page.goto(`${this.rootUrl}/${path}`)
	}

	public async pause(): Promise<void> {
		await this.page.pause()
	}
}
