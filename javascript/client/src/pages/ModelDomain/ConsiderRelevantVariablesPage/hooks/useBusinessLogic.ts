/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	ElementDefinition,
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

export function useBusinessLogic(): {
	isEditing: boolean
	page: Maybe<string>
	addFactor: (factor: OptionalId<CausalFactor>) => void
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
		isEditing,
		addFactor,
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
