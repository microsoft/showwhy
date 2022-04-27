/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuItem } from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import type { CausalFactor, Definition } from '@showwhy/types'
import {
	CausalFactorType,
	CausalModelLevel,
	CommandActionType,
	DefinitionType,
} from '@showwhy/types'
import upperFirst from 'lodash/upperFirst'
import { useMemo } from 'react'

import { useCausalEffects } from '~hooks'
import { getDefinitionsByType } from '~utils'

export function useDefinitionDropdownOptions(
	definitions: Definition[],
	causalFactors: CausalFactor[],
): IContextualMenuItem[] {
	const causalEffects = useCausalEffects(CausalModelLevel.Maximum)
	return useMemo((): IContextualMenuItem[] => {
		const menuItems: IContextualMenuItem[] = [...baseMenuItems]
		const population = getDefinitionsByType(
			DefinitionType.Population,
			definitions,
		)
		const exposure = getDefinitionsByType(DefinitionType.Exposure, definitions)
		const outcome = getDefinitionsByType(DefinitionType.Outcome, definitions)
		const exposureDeterminant = getCausalFactorsByType(
			causalFactors,
			causalEffects.exposureDeterminants,
		)
		const outcomeDeterminant = getCausalFactorsByType(
			causalFactors,
			causalEffects.outcomeDeterminants,
		)
		const confounders = getCausalFactorsByType(
			causalFactors,
			causalEffects.confounders,
		)

		population.length &&
			menuItems.push(buildDropdownOption(population, DefinitionType.Population))

		exposure.length &&
			menuItems.push(buildDropdownOption(exposure, DefinitionType.Exposure))

		outcome.length &&
			menuItems.push(buildDropdownOption(outcome, DefinitionType.Outcome))

		exposureDeterminant &&
			menuItems.push(
				buildDropdownOption(
					exposureDeterminant,
					CausalFactorType.CauseExposure,
				),
			)

		outcomeDeterminant &&
			menuItems.push(
				buildDropdownOption(outcomeDeterminant, CausalFactorType.CauseOutcome),
			)

		confounders &&
			menuItems.push(
				buildDropdownOption(confounders, CausalFactorType.Confounders),
			)

		return menuItems
	}, [definitions, causalFactors, causalEffects])
}

function buildDropdownOption(
	all: Definition[],
	type: DefinitionType | CausalFactorType,
): IContextualMenuItem {
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

function getCausalFactorsByType(
	causalFactors: CausalFactor[],
	list: string[],
): CausalFactor[] {
	return causalFactors.filter(x => list.includes(x.variable))
}

const baseMenuItems: IContextualMenuItem[] = [
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
		text: 'Reset variable selection',
		title: 'Reset variable selection',
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
