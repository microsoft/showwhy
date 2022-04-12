/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from './Page'
import { dataAttr } from '../util'

type fn = (type: string) => string

const selectors: Record<string, string> = {
	group: dataAttr('field-group'),
	title: dataAttr('field-group-title'),
	hypothesis: dataAttr('hypothesis-choice'),
}

const fnSelectors: Record<string, fn> = {
	label: (type: string) => `#${type.toLowerCase()}-label`,
	dataset: (type: string) => `#${type.toLowerCase()}-dataset`,
	description: (type: string) => `#${type.toLowerCase()}-description`,
}

interface Field {
	type: string
	label: string
	dataset?: string
	description?: string
}

export class DefineCausalQuestionPO extends Page {
	protected PAGE_PATH: string = '#/model/causal-question'

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.group, { state: 'visible' })
	}

	public async enterFieldGroupData(fieldData: Field): Promise<void> {
		const { type, label, dataset = '', description = '' } = fieldData
		await this.page.fill(fnSelectors.label(type), label)
		await this.page.fill(fnSelectors.dataset(type), dataset)
		await this.page.fill(fnSelectors.description(type), description)
	}

	public async selectHypothesis(type: string): Promise<void> {
		await this.page.click(`${selectors.hypothesis} + label:has-text('${type}')`)
	}
}
