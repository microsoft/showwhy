/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption } from '@fluentui/react'
import { DropdownMenuItemType } from '@fluentui/react'
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
): IDropdownOption[] => {
	const options: IDropdownOption[] = [
		{
			key: type,
			text: upperFirst(type.toString()),
			itemType: DropdownMenuItemType.Header,
		},
	]
	all.forEach(x => {
		options.push({
			key: x.id,
			text: x.variable,
			data: {
				type: type,
			},
			disabled: !!x.column,
		})
	})
	return options
}

export function useDefinitionDropdownOptions(
	defineQuestion: Experiment,
	causalFactors: CausalFactor[],
): IDropdownOption[] {
	return useMemo((): IDropdownOption[] => {
		const { population, exposure, outcome } = defineQuestion
		const all: IDropdownOption[] = []

		population &&
			population.definition &&
			all.push(
				...buildDropdownOption(
					population.definition,
					DefinitionType.Population,
				),
			)
		exposure &&
			exposure.definition &&
			all.push(
				...buildDropdownOption(exposure.definition, DefinitionType.Exposure),
			)
		outcome &&
			outcome.definition &&
			all.push(
				...buildDropdownOption(outcome.definition, DefinitionType.Outcome),
			)
		causalFactors &&
			all.push(...buildDropdownOption(causalFactors, DefinitionType.Factor))

		all.push({
			key: '--actions--',
			text: '',
			itemType: 2,
			data: {
				button: true,
			},
			selected: false,
		})
		return all
	}, [defineQuestion, causalFactors])
}
