/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	Definition,
	Handler,
	Maybe,
	OptionalId,
} from '@showwhy/types'
import { useMemo, useState } from 'react'

import { useCausalFactors } from '~state'

import {
	useAddFactor,
	useDeleteFactor,
	useEditFactor,
	useFactorsNavigation,
	useSetPageDone,
} from '../ConsiderRelevantVariablesPage.hooks'
import { useFactorItems } from './useFactorItems'

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
	const { items } = useFactorItems(
		flatFactorsList,
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

function useFlatFactorsList(causalFactors: CausalFactor[]): Definition[] {
	return useMemo((): Definition[] => {
		return causalFactors.map((x: CausalFactor) => {
			return {
				id: x.id,
				variable: x.variable,
				description: x.description,
			}
		}) as Definition[]
	}, [causalFactors])
}
