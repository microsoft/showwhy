/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from './Page'
import { dataAttr } from '../util'

const selectors: Record<string, string> = {
	group: dataAttr('field-group'),
	title: dataAttr('field-group-title'),
	label: dataAttr('field-group-label'),
	dataset: dataAttr('field-group-dataset'),
	description: dataAttr('field-group-description'),
	hypothesis: dataAttr('hypothesis-choice'),
}

interface Field {
	type: string
	label: string
	dataset?: string
	description?: string
}

export class DescribeElementsPage extends Page {
	public open() {
		return super.open('#/define/elements')
	}

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.group, { state: 'visible' })
	}

	public async enterFieldGroupData(fieldData: Field): Promise<void> {
		const { type, label, dataset, description } = fieldData
		// FIXME:
		// const selector = (sel: string) =>
		// 	`${selectors.group}:has-text('${type}') ${sel}`
		// this.page.fill(selector(selectors.label), label),
		// this.page.fill(selector(selectors.dataset), dataset),
		// this.page.fill(selector(selectors.description), description),
		// await this.page.screenshot({ pa:th: 'screenshot-before-promise.png', fullPage: true})

		const promises = [
			this.page.fill('#population-label', label),
			this.page.fill('#population-dataset', dataset),
			this.page.fill('#population-description', description),
		]
		await Promise.all(promises)

		//FIXME:
		// await this.page.fill(selector(selectors.label), label)

		// if (dataset) {
		// 	// promises.push(this.page.fill(selector(selectors.dataset), dataset))
		// }

		// if (description) {
		// 	// promises.push(this.page.fill(selector(selectors.description), description))
		// }

		await this.page.pause()
	}

	public async selectHypothesis(type: string): Promise<void> {
		await this.page.click(`${selectors.hypothesis} + label:has-text('${type}')`)
	}
}
