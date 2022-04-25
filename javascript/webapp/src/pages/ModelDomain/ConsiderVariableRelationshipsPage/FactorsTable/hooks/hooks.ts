/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import type { CausalFactor, FlatCausalFactor } from '@showwhy/types'
import { CausalFactorType } from '@showwhy/types'
import { useCallback, useMemo, useState } from 'react'

import { useDegreeComboBox } from '~hooks'
import { useCausalFactors, useSetCausalFactors } from '~state'

import { useFlatFactorsList, useSaveFactors } from './factors'
import { useTextField } from './inputs'
import { useOnChangeCauses, useOnChangeReasoning } from './onChange'

export function useFactorsTable(): {
	flatFactorsList: FlatCausalFactor[]
	itemList: Record<string, any>[]
} {
	const [multiline, { toggle: toggleMultiline }] = useBoolean(false)
	const [values, setValues] = useState<CausalFactor[]>([])
	const setCausalFactors = useSetCausalFactors()
	const causalFactors = useCausalFactors()

	const save = useCallback(
		newList => {
			setCausalFactors(newList)
			setValues([])
		},
		[setValues, setCausalFactors],
	)

	const flatFactorsList = useFlatFactorsList(causalFactors, values)
	const saveNewFactors = useSaveFactors(causalFactors, setValues, save)

	const onChangeCauses = useOnChangeCauses(flatFactorsList, saveNewFactors)
	const onChangeReasoning = useOnChangeReasoning(
		flatFactorsList,
		toggleMultiline,
		saveNewFactors,
		multiline,
	)

	const comboBoxExposure = useDegreeComboBox(onChangeCauses)
	const comboBoxOutcome = useDegreeComboBox(onChangeCauses)
	const textField = useTextField(onChangeReasoning)

	const itemList = useMemo((): Record<string, any>[] => {
		return flatFactorsList.map((factor: FlatCausalFactor, index: number) => {
			return {
				variable: factor.variable,
				[CausalFactorType.CauseExposure]: comboBoxExposure(
					factor[CausalFactorType.CauseExposure],
					CausalFactorType.CauseExposure,
					factor.id,
				),
				[CausalFactorType.CauseOutcome]: comboBoxOutcome(
					factor[CausalFactorType.CauseOutcome],
					CausalFactorType.CauseOutcome,
					factor.id,
				),
				reasoning: textField(factor),
				dataPw: `factor-${index}`,
			}
		})
	}, [flatFactorsList, comboBoxOutcome, comboBoxExposure, textField])

	return {
		flatFactorsList,
		itemList,
	}
}
