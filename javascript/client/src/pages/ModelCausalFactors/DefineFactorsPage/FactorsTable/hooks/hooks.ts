/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import type { FlatCausalFactor, CausalFactor } from '@showwhy/types'
import { useCallback, useMemo, useState } from 'react'
import { useFlatFactorsList, useSaveFactors } from './factors'
import { useCheckbox, useComboBox, useTextField } from './inputs'
import {
	useOnChangeCauses,
	useOnChangeDegree,
	useOnChangeReasoning,
} from './onChange'
import { useCausalFactors, useSetCausalFactors } from '~state'
import type { Item } from '~types'

export function useFactorsTable(causeType: string): {
	flatFactorsList: FlatCausalFactor[]
	itemList: Item[]
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

	const flatFactorsList = useFlatFactorsList(causalFactors, causeType, values)
	const saveNewFactors = useSaveFactors(
		causalFactors,
		causeType,
		setValues,
		save,
	)

	const onChangeCauses = useOnChangeCauses(flatFactorsList, saveNewFactors)
	const onChangeDegree = useOnChangeDegree(flatFactorsList, saveNewFactors)
	const onChangeReasoning = useOnChangeReasoning(
		flatFactorsList,
		toggleMultiline,
		saveNewFactors,
		multiline,
	)

	const checkbox = useCheckbox(onChangeCauses)
	const comboBox = useComboBox(onChangeDegree)
	const textField = useTextField(onChangeReasoning)

	const itemList = useMemo((): Item[] => {
		return flatFactorsList.map((factor: FlatCausalFactor) => {
			return {
				variable: factor.variable,
				causes: checkbox(factor),
				degree: comboBox(factor),
				reasoning: textField(factor),
			}
		})
	}, [flatFactorsList, checkbox, comboBox, textField])

	return {
		flatFactorsList,
		itemList,
	}
}
