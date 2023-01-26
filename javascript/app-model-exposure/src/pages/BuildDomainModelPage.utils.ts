/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { RadioButtonChoice } from '@showwhy/app-common'

import type { CausalFactor } from '../types/causality/CausalFactor.js'
import { CausalFactorType } from '../types/causality/CausalFactorType.js'
import { CausalModelLevel } from '../types/causality/CausalModelLevel.js'
import type { FlatCausalFactor } from '../types/causality/FlatCausalFactor.js'
import type { Header } from '../types/Header.js'
import type { Handler1, Maybe } from '../types/primitives.js'

export function buildCausalModelOptions(
	selectedCausalModel: CausalModelLevel,
	onChange: Handler1<Maybe<RadioButtonChoice>>,
): RadioButtonChoice[] {
	return [
		{
			key: CausalModelLevel.Maximum,
			title: CausalModelLevel.Maximum,
			isSelected: selectedCausalModel === CausalModelLevel.Maximum,
			description:
				'Includes all edges with strong, moderate, or weak causal effects',
			onChange,
		},
		{
			key: CausalModelLevel.Intermediate,
			title: CausalModelLevel.Intermediate,
			isSelected: selectedCausalModel === CausalModelLevel.Intermediate,
			description:
				'Includes all edges with a strong or moderate causal effects',
			onChange,
		},
		{
			key: CausalModelLevel.Minimum,
			title: CausalModelLevel.Minimum,
			isSelected: selectedCausalModel === CausalModelLevel.Minimum,
			description: 'Includes all edges with strong causal effects only',
			onChange,
		},
		{
			key: CausalModelLevel.Unadjusted,
			title: CausalModelLevel.Unadjusted,
			isSelected: selectedCausalModel === CausalModelLevel.Unadjusted,
			description: 'Includes only the causal edge from exposure to outcome',
			onChange,
		},
	]
}

export function buildFlatFactorsList(
	causalFactors: CausalFactor[],
	values?: CausalFactor[],
): FlatCausalFactor[] {
	return causalFactors.map((factor: CausalFactor) => {
		const equal =
			values?.find((existing) => existing.id === factor.id)?.causes ||
			factor.causes ||
			({} as FlatCausalFactor)

		return {
			variable: factor.variable,
			[CausalFactorType.CauseExposure]:
				equal[CausalFactorType.CauseExposure] ?? null,
			[CausalFactorType.CauseOutcome]:
				equal[CausalFactorType.CauseOutcome] ?? null,
			reasoning: equal.reasoning || factor.description,
			id: factor.id,
			description: factor.description,
		}
	}) as FlatCausalFactor[]
}

export const buildHeaders = (width: number): Header[] => {
	return [
		{ fieldName: 'variable', name: 'Label', width: width * 0.2 || 300 },
		{
			fieldName: CausalFactorType.CauseExposure,
			name: 'Causes Exposure',
			width: width * 0.15 || 150,
		},
		{
			fieldName: CausalFactorType.CauseOutcome,
			name: 'Causes Outcome',
			width: width * 0.15 || 150,
		},
		{ fieldName: 'reasoning', name: 'Reasoning', width: width * 0.5 || 500 },
	]
}

export const buildFormHeaders = (width: number): Header[] => {
	return [
		{ fieldName: 'variable', name: 'Label', width: width * 0.3 || 400 },
		{
			fieldName: 'description',
			name: 'Description',
			width: width * 0.6 || 650,
		},
		{ fieldName: 'actions', name: 'Actions', width: width * 0.1 || 200 },
	]
}
