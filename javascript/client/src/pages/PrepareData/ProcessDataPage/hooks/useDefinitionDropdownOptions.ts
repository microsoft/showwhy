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
import { CommandActionType, DefinitionType } from '@showwhy/types'
import upperFirst from 'lodash/upperFirst'
import { useMemo } from 'react'

import type { CausalEffectsProps } from '~hooks'

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
	causalEffects: CausalEffectsProps,
): IContextualMenuItem[] {
	return useMemo((): IContextualMenuItem[] => {
		const { population, exposure, outcome } = defineQuestion
		const all: IContextualMenuItem[] = [
			{
				key: 'subject-identifier',
				text: 'Set as subject identifier',
				title: 'Set as subject identifier',
				data: {
					button: true,
					type: CommandActionType.SubjectIdentifier,
					bottomDivider: true,
				},
			},
			{
				key: 'reset-action',
				text: 'Reset',
				title: 'Reset',
				data: {
					button: true,
					type: CommandActionType.Reset,
				},
			},
			{
				key: 'variable-action',
				text: 'Add variable',
				title: 'Add variable',
				data: {
					button: true,
					type: CommandActionType.AddVariable,
					bottomDivider: true,
				},
			},
		]

		const exposureDeterminant = causalFactors.filter(x =>
			causalEffects.exposureDeterminants.includes(x.variable),
		)
		const outcomeDeterminant = causalFactors.filter(x =>
			causalEffects.outcomeDeterminants.includes(x.variable),
		)
		const confounders = causalFactors.filter(x =>
			causalEffects.confounders.includes(x.variable),
		)

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

		exposureDeterminant &&
			all.push(
				buildDropdownOption(exposureDeterminant, DefinitionType.CauseExposure),
			)

		outcomeDeterminant &&
			all.push(
				buildDropdownOption(outcomeDeterminant, DefinitionType.CauseOutcome),
			)

		confounders &&
			all.push(buildDropdownOption(confounders, DefinitionType.Confounders))
		return all
	}, [defineQuestion, causalFactors, causalEffects])
}
