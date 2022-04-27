/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import type { CausalFactor, FlatCausalFactor } from '@showwhy/types'
import { useCallback, useState } from 'react'

import { useCausalFactors, useSetCausalFactors } from '~state'

import { useFlatFactorsList, useSaveFactors } from './factors'
import { useItems } from './items'
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

	const itemList = useItems(flatFactorsList, onChangeCauses, onChangeReasoning)

	return {
		flatFactorsList,
		itemList,
	}
}
