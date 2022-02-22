/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Specification } from '@data-wrangling-components/core'
import { useCallback } from 'react'
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { replaceItemAtIndex } from '~utils'

export const stepsColumnsPrepSpecification = atom<Specification[]>({
	key: 'columns-prep-spec',
	default: [],
})

export function useColumnsPrepSpecification(): Specification[] {
	return useRecoilValue(stepsColumnsPrepSpecification)
}

export function useSetColumnsPrepSpecification(): SetterOrUpdater<
	Specification[]
> {
	return useSetRecoilState(stepsColumnsPrepSpecification)
}

// step doesn't have an id. What is the identifier
export function useSetOrUpdateColumnsPrepSpecification(): (
	specification: Specification,
	index?: number,
) => void {
	const setColumnsPrepSpecification = useSetRecoilState(
		stepsColumnsPrepSpecification,
	)
	return useCallback(
		(specification: Specification, index?: number) => {
			setColumnsPrepSpecification(prev => {
				return index === undefined
					? [...prev, specification]
					: replaceItemAtIndex(prev, index, specification)
			})
		},
		[setColumnsPrepSpecification],
	)
}

export function useResetColumnsPrepSpecification(): Resetter {
	return useResetRecoilState(stepsColumnsPrepSpecification)
}
