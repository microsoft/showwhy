/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuItem } from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import type {
	CausalFactor,
	ElementDefinition,
	Experiment,
} from '@showwhy/types'
import upperFirst from 'lodash/upperFirst'
import { useMemo } from 'react'

export enum DefinitionType {
	Population = 'population',
	Exposure = 'exposure',
	Outcome = 'outcome',
	Factor = 'causal factor',
}

const buildDropdownOption = (
	all: ElementDefinition[],
	type: DefinitionType,
): IContextualMenuItem => {
	const options: IContextualMenuItem = {
		key: type,
		itemType: ContextualMenuItemType.Section,
		sectionProps: {
			title: upperFirst(type.toString()),
			items: all.map(x => {
				return {
					key: x.id,
					text: x.variable,
					title: x.variable,
					data: {
						type: type,
					},
					disabled: !!x.column,
				}
			}),
		},
	}
	return options
}

export function useDefinitionDropdownOptions(
	defineQuestion: Experiment,
	causalFactors: CausalFactor[],
): IContextualMenuItem[] {
	return useMemo((): IContextualMenuItem[] => {
		const { population, exposure, outcome } = defineQuestion
		const all: IContextualMenuItem[] = [
			{
				key: 'reset-action',
				text: 'Reset',
				title: 'Reset',
				data: {
					button: true,
					reset: true,
				},
			},
		]

		population &&
			population.definition &&
			all.push(
				buildDropdownOption(population.definition, DefinitionType.Population),
			)
		exposure &&
			exposure.definition &&
			all.push(
				buildDropdownOption(exposure.definition, DefinitionType.Exposure),
			)
		outcome &&
			outcome.definition &&
			all.push(buildDropdownOption(outcome.definition, DefinitionType.Outcome))
		causalFactors &&
			all.push(buildDropdownOption(causalFactors, DefinitionType.Factor))
		return all
	}, [defineQuestion, causalFactors])
}
