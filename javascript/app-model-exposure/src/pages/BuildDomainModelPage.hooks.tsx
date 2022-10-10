/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption } from '@fluentui/react'
import { TextField } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import type { RadioButtonChoice } from '@showwhy/app-common'
import { useCallback, useMemo, useState } from 'react'
import { useXarrow } from 'react-xarrows'

import { DegreeDropdown } from '../components/DegreeDropdown.js'
import {
	useCausalFactors,
	useSetCausalFactors,
} from '../state/causalFactors.js'
import { useSetPrimarySpecificationConfig } from '../state/primarySpecificationConfig.js'
import type { BeliefDegree } from '../types/causality/BeliefDegree.js'
import type { CausalFactor } from '../types/causality/CausalFactor.js'
import { CausalFactorType } from '../types/causality/CausalFactorType.js'
import { CausalModelLevel } from '../types/causality/CausalModelLevel.js'
import type { Cause } from '../types/causality/Cause.js'
import type { FlatCausalFactor } from '../types/causality/FlatCausalFactor.js'
import type { Handler, Setter } from '../types/primitives.js'
import { replaceItemAtIndex } from '../utils/arrays.js'
import { buildFlatFactorsList } from './BuildDomainModelPage.utils.js'

function useSaveFactors(
	causalFactors: CausalFactor[],
	setValues: Setter<CausalFactor[]>,
	save: (factors: CausalFactor[]) => void,
): (id: string, value: Cause) => void {
	return useCallback(
		(id: string, newValue: Cause) => {
			const index = causalFactors.findIndex(v => v.id === id)
			const oldFactor = causalFactors.find(x => x.id === id)
			const oldCauses = oldFactor?.causes

			const causes = {
				...(oldCauses || {}),
				[CausalFactorType.CauseExposure]:
					newValue[CausalFactorType.CauseExposure] ?? null,
				[CausalFactorType.CauseOutcome]:
					newValue[CausalFactorType.CauseOutcome] ?? null,
				reasoning: newValue.reasoning,
			} as Cause
			const factorObject = {
				...oldFactor,
				causes,
			} as CausalFactor

			const newFactorsList = replaceItemAtIndex(
				causalFactors,
				index,
				factorObject,
			)
			setValues(newFactorsList)
			save(newFactorsList)
		},
		[causalFactors, setValues, save],
	)
}

function useOnChangeCauses(
	flatFactorsList: FlatCausalFactor[],
	saveNewFactors: (id: string, value: Cause) => void,
): (selected: IDropdownOption, type: CausalFactorType, id?: string) => void {
	return useCallback(
		(selected: IDropdownOption, type: CausalFactorType, id?: string) => {
			const newValue = {
				...flatFactorsList.find(x => x.id === id),
				[type as keyof Cause]: selected.key as BeliefDegree,
			} as Cause
			saveNewFactors(id as string, newValue)
		},
		[flatFactorsList, saveNewFactors],
	)
}

function useOnChangeReasoning(
	flatFactorsList: FlatCausalFactor[],
	toggleMultiline: Handler,
	saveNewFactors: (id: string, value: Cause) => void,
	multiline: boolean,
): (id: string, newText: string) => void {
	return useCallback(
		(id: string, newText: string): void => {
			const newValue = flatFactorsList.find(x => x.id === id) as Cause
			newValue.reasoning = newText

			const newMultiline = (newText?.length || 0) > 50
			if (newMultiline !== multiline) {
				toggleMultiline()
			}
			saveNewFactors(id, newValue)
		},
		[flatFactorsList, toggleMultiline, saveNewFactors, multiline],
	)
}

export function useFactorsTable(): {
	flatFactorsList: FlatCausalFactor[]
	itemList: Record<string, any>[] //eslint-disable-line
} {
	const [multiline, { toggle: toggleMultiline }] = useBoolean(false)
	const [values, setValues] = useState<CausalFactor[]>([])
	const causalFactors = useCausalFactors()
	const setCausalFactors = useSetCausalFactors()
	const flatFactorsList = buildFlatFactorsList(causalFactors, values)

	const save = useCallback(
		(newList: CausalFactor[]) => {
			setCausalFactors(newList)
			setValues([])
		},
		[setValues, setCausalFactors],
	)
	const saveNewFactors = useSaveFactors(causalFactors, setValues, save)

	const onChangeCauses = useOnChangeCauses(flatFactorsList, saveNewFactors)
	const onChangeReasoning = useOnChangeReasoning(
		flatFactorsList,
		toggleMultiline as Handler<void>,
		saveNewFactors,
		multiline as boolean,
	)

	const itemList = useItems(flatFactorsList, onChangeCauses, onChangeReasoning)

	return {
		flatFactorsList,
		itemList,
	}
}

function useItems(
	flatFactorsList: FlatCausalFactor[],
	onChangeCauses: (
		selected: IDropdownOption,
		type: CausalFactorType,
		id?: string,
	) => void,
	onChangeReasoning: (id: string, newText: string) => void,
	//eslint-disable-next-line
): Record<string, any>[] {
	//eslint-disable-next-line
	return useMemo((): Record<string, any>[] => {
		return flatFactorsList.map((factor: FlatCausalFactor, index: number) => {
			return {
				variable: factor.variable,
				[CausalFactorType.CauseExposure]: (
					<DegreeDropdown
						onChangeDegree={onChangeCauses}
						degree={factor[CausalFactorType.CauseExposure]}
						type={CausalFactorType.CauseExposure}
						id={factor.id}
					/>
				),
				[CausalFactorType.CauseOutcome]: (
					<DegreeDropdown
						onChangeDegree={onChangeCauses}
						degree={factor[CausalFactorType.CauseOutcome]}
						type={CausalFactorType.CauseOutcome}
						id={factor.id}
					/>
				),
				reasoning: (
					<TextField
						value={factor.reasoning}
						onChange={(_, val) => onChangeReasoning(factor.id, val || '')}
						multiline={factor.reasoning.length > 30}
						resizable={false}
					/>
				),
				dataPw: `factor-${index}`,
			}
		})
	}, [flatFactorsList, onChangeCauses, onChangeReasoning])
}

export function useOnCausalModelChange(): (option?: RadioButtonChoice) => void {
	const updateXarrow = useXarrow()
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()

	return useCallback(
		(option?: RadioButtonChoice) => {
			updateXarrow()
			setPrimarySpecificationConfig(prev => ({
				...prev,
				causalModel:
					(option && (option?.key as CausalModelLevel)) ||
					CausalModelLevel.Maximum,
			}))
		},
		[updateXarrow, setPrimarySpecificationConfig],
	)
}
