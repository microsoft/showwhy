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
	protected PAGE_PATH: string = '#/define/elements'

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.group, { state: 'visible' })
	}

	public async enterFieldGroupData(fieldData: Field): Promise<void> {
		const { type, label, dataset, description } = fieldData
		await this.page.fill(`#${type.toLowerCase()}-label`, label),
			await this.page.fill(`#${type.toLowerCase()}-dataset`, dataset || ``),
			await this.page.fill(
				`#${type.toLowerCase()}-description`,
				description || ``,
			),
			await this.page.pause()
	}

	public async selectHypothesis(type: string): Promise<void> {
		await this.page.click(`${selectors.hypothesis} + label:has-text('${type}')`)
	}
}
