/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo, useState } from 'react'
import type { SetterOrUpdater } from 'recoil'
import { v4 } from 'uuid'

import {
	useCausalFactors,
	useSetCausalFactors,
} from '../state/causalFactors.js'
import type { CausalFactor } from '../types/causality/CausalFactor.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { Maybe, OptionalId } from '../types/primitives.js'
import { replaceItemAtIndex } from '../utils/arrays.js'
import { useFactorItems } from './useFactorItems.js'

export function useDetailsList(): {
	addFactor: (factor: OptionalId<CausalFactor>) => void
	items: any // eslint-disable-line
} {
	const causalFactors = useCausalFactors()
	const [factor, setFactor] = useState<CausalFactor>()
	const [isEditing, setIsEditing] = useState(false)

	const deleteFactor = useDeleteFactor()
	const editFactor = useEditFactor(setFactor, setIsEditing)
	const addFactor = useAddFactor(isEditing, setIsEditing, setFactor)
	const flatFactorsList = useFlatFactorsList(causalFactors)
	const items = useFactorItems(
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
		addFactor,
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

function useAddOrEditFactor(
	causalFactors: CausalFactor[],
	setCausalFactors: SetterOrUpdater<CausalFactor[]>,
): (factor: OptionalId<CausalFactor>) => void {
	return useCallback(
		(factor: OptionalId<CausalFactor>, factors = causalFactors) => {
			const exists = factors.find((f) => f.id === factor?.id) || {}

			const existsIndex = factors.findIndex((f) => f.id === factor?.id)
			const newFactor = {
				...exists,
				...factor,
				id: factor?.id ?? v4(),
			} as CausalFactor

			let newFactorList = factors

			if (existsIndex >= 0) {
				newFactorList = replaceItemAtIndex(
					newFactorList,
					existsIndex,
					newFactor,
				)
			} else {
				newFactorList = [...newFactorList, newFactor]
			}

			setCausalFactors(newFactorList)
		},
		[causalFactors, setCausalFactors],
	)
}

function useAddFactor(
	isEditing: boolean,
	setIsEditing: (value: boolean) => void,
	setFactor: (factor: Maybe<CausalFactor>) => void,
): (factor: OptionalId<CausalFactor>) => void {
	const addOrEditFactor = useAddOrEditFactor(
		useCausalFactors(),
		useSetCausalFactors(),
	)
	return useCallback(
		(newFactor: OptionalId<CausalFactor>) => {
			addOrEditFactor(newFactor)
			isEditing && setIsEditing(false)
			setFactor(undefined)
		},
		[addOrEditFactor, setIsEditing, isEditing, setFactor],
	)
}

function useDeleteFactor(): (factor: CausalFactor) => void {
	const causalFactors = useCausalFactors()
	const setCausalFactors = useSetCausalFactors()
	return useCallback(
		(deletedFactor) => {
			setCausalFactors(causalFactors.filter((v) => v.id !== deletedFactor.id))
		},
		[causalFactors, setCausalFactors],
	)
}

function useEditFactor(
	setFactor: (factor: CausalFactor) => void,
	setIsEditing: (isEditing: boolean) => void,
): (factor: CausalFactor) => void {
	return useCallback(
		(factorToEdit) => {
			setFactor(factorToEdit)
			setIsEditing(true)
		},
		[setFactor, setIsEditing],
	)
}
