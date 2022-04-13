/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { HeaderData } from '@showwhy/components'
import type {
	CausalFactor,
	ElementDefinition,
	FlatCausalFactor,
	Handler,
	Maybe,
	OptionalId,
} from '@showwhy/types'
import { useMemo, useState } from 'react'

import { useCausalFactors } from '~state'

import { useTableComponent } from '../../ConsiderAlternativeDefinitionsPage/ConsiderAlternativeDefinitionsPage.hooks'
import {
	useAddFactor,
	useDeleteFactor,
	useEditFactor,
	useFactorsNavigation,
	useSetPageDone,
} from '../ConsiderRelevantVariablesPage.hooks'

const tableHeaders: HeaderData[] = [
	{ fieldName: 'variable', value: 'Label', width: '15%' },
	{ fieldName: 'description', value: 'Description' },
]

export function useBusinessLogic(): {
	factor: Maybe<CausalFactor>
	isEditing: boolean
	page: Maybe<string>
	addFactor: (factor: OptionalId<CausalFactor>) => void
	editFactor: (factor: CausalFactor) => void
	deleteFactor: (factor: CausalFactor) => void
	setFactor: (factor: Maybe<CausalFactor>) => void
	setIsEditing: (value: boolean) => void
	goToFactorsPage: Handler
	items: any
} {
	const causalFactors = useCausalFactors()
	const [factor, setFactor] = useState<CausalFactor>()
	const [isEditing, setIsEditing] = useState(false)

	const deleteFactor = useDeleteFactor()
	const editFactor = useEditFactor(setFactor, setIsEditing)
	const addFactor = useAddFactor(isEditing, setIsEditing, setFactor)
	const flatFactorsList = useFlatFactorsList(causalFactors)
	const [goToFactorsPage, factorsPathData] = useFactorsNavigation()
	useSetPageDone()
	const { items } = useTableComponent(
		flatFactorsList,
		undefined,
		factor,
		deleteFactor,
		addFactor,
		editFactor,
		() => {
			setIsEditing(false)
			setFactor(undefined)
		},
	)

	return {
		items,
		factor,
		isEditing,
		addFactor,
		editFactor,
		deleteFactor,
		setFactor,
		setIsEditing,
		goToFactorsPage,
		page: factorsPathData?.page,
	}
}

function useFlatFactorsList(
	causalFactors: CausalFactor[],
): ElementDefinition[] {
	return useMemo((): ElementDefinition[] => {
		return causalFactors.map((x: CausalFactor) => {
			return {
				id: x.id,
				variable: x.variable,
				description: x.description,
			}
		}) as ElementDefinition[]
	}, [causalFactors])
}
