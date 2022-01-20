/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAddOrEditFactor, usePageType, useVariableOptions } from '~hooks'
import { CausalFactor, FlatCausalFactor } from '~interfaces'
import { useCausalFactors, useSetCausalFactors } from '~state'

interface PathData {
	path: string | undefined
	page: string | undefined
}

export function useBusinessLogic() {
	const causalFactors = useCausalFactors()
	const setCausalFactors = useSetCausalFactors()
	const pageType = usePageType()
	const variables = useVariableOptions()
	const [factor, setFactor] = useState<CausalFactor>()
	const [isEditing, setIsEditing] = useState(false)
	const [historyState, setHistoryState] = useState<string>()
	const addOrEditFactor = useAddOrEditFactor()
	const history = useHistory()

	const deleteFactor = useCallback(
		deletedFactor => {
			setCausalFactors(causalFactors.filter(v => v.id !== deletedFactor.id))
		},
		[causalFactors, setCausalFactors],
	)
	const editFactor = useCallback(
		factorToEdit => {
			setFactor(factorToEdit)
			setIsEditing(true)
		},
		[setFactor, setIsEditing],
	)

	const addFactor = useCallback(
		(newFactor: Omit<CausalFactor, 'id'>) => {
			addOrEditFactor(newFactor)
			isEditing && setIsEditing(false)
			setFactor(undefined)
		},
		[addOrEditFactor, setIsEditing, isEditing, setFactor],
	)

	const factorsPathData = useMemo((): PathData => {
		return {
			path: historyState,
			page: historyState?.replace(/-/g, ' '),
		}
	}, [historyState])

	const flatFactorsList = useMemo((): FlatCausalFactor[] => {
		return causalFactors.map((x: CausalFactor) => {
			return {
				id: x.id,
				variable: x.variable,
				description: x.description,
			}
		}) as FlatCausalFactor[]
	}, [causalFactors])

	useEffect(() => {
		history.location.state && setHistoryState(history.location.state as string)
	}, [history.location.state, setHistoryState])

	const goToFactorsPage = useCallback(() => {
		history.push(`/define-factors/${factorsPathData.path}`)
		setHistoryState(undefined)
	}, [factorsPathData, setHistoryState, history])

	return {
		factor,
		isEditing,
		flatFactorsList,
		addFactor,
		editFactor,
		deleteFactor,
		setFactor,
		setIsEditing,
		goToFactorsPage: factorsPathData?.path && goToFactorsPage,
		page: factorsPathData?.page,
		pageType,
		variables,
	}
}
