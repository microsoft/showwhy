/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	FlatCausalFactor,
	Handler,
	Maybe,
	OptionalId,
} from '@showwhy/types'
import { useMemo, useState } from 'react'

import { useCausalFactors } from '~state'

import { useAddFactor } from './useAddFactor'
import { useDeleteFactor } from './useDeleteFactor'
import { useEditFactor } from './useEditFactor'
import { useFactorsNavigation } from './useFactorsNavigation'
import { useSetPageDone } from './useSetPageDone'

export function useBusinessLogic(): {
	factor: Maybe<CausalFactor>
	isEditing: boolean
	flatFactorsList: FlatCausalFactor[]
	page: Maybe<string>
	addFactor: (factor: OptionalId<CausalFactor>) => void
	editFactor: (factor: CausalFactor) => void
	deleteFactor: (factor: CausalFactor) => void
	setFactor: (factor: Maybe<CausalFactor>) => void
	setIsEditing: (value: boolean) => void
	goToFactorsPage: Handler
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

	return {
		factor,
		isEditing,
		flatFactorsList,
		addFactor,
		editFactor,
		deleteFactor,
		setFactor,
		setIsEditing,
		goToFactorsPage,
		page: factorsPathData?.page,
	}
}

function useFlatFactorsList(causalFactors: CausalFactor[]): FlatCausalFactor[] {
	return useMemo((): FlatCausalFactor[] => {
		return causalFactors.map((x: CausalFactor) => {
			return {
				id: x.id,
				variable: x.variable,
				description: x.description,
			}
		}) as FlatCausalFactor[]
	}, [causalFactors])
}
