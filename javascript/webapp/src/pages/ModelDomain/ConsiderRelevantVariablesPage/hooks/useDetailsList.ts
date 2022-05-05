/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Header } from '@showwhy/components'
import type { CausalFactor, Definition, OptionalId } from '@showwhy/types'
import { useMemo, useState } from 'react'

import { useDimensions } from '~hooks'
import { useCausalFactors } from '~state'

import { useAddFactor } from './useAddFactor'
import { useDeleteFactor } from './useDeleteFactor'
import { useEditFactor } from './useEditFactor'
import { useFactorItems } from './useFactorItems'
import { useHeaders } from './useHeaders'
import { useSetPageDone } from './useSetPageDone'

export function useDetailsList(): {
	isEditing: boolean
	addFactor: (factor: OptionalId<CausalFactor>) => void
	items: any
	ref: React.MutableRefObject<HTMLDivElement | null>
	headers: Header[]
} {
	const causalFactors = useCausalFactors()
	const [factor, setFactor] = useState<CausalFactor>()
	const [isEditing, setIsEditing] = useState(false)

	const deleteFactor = useDeleteFactor()
	const editFactor = useEditFactor(setFactor, setIsEditing)
	const addFactor = useAddFactor(isEditing, setIsEditing, setFactor)
	const flatFactorsList = useFlatFactorsList(causalFactors)
	const { ref, width } = useDimensions()
	const headers = useHeaders(width)
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
		ref,
		headers,
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
