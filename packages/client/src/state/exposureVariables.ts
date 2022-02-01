/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { VariableDefinition1 } from '~types'

export const exposureVariablesState = atom<VariableDefinition1[]>({
	key: 'exposure-variables-state',
	default: [],
})

export function useExposureVariables(): VariableDefinition1[] {
	return useRecoilValue(exposureVariablesState)
}

export function useSetExposureVariables(): SetterOrUpdater<
	VariableDefinition1[]
> {
	return useSetRecoilState(exposureVariablesState)
}

export function useSetOrUpdateExposureVariables(): (
	variableDefinition: VariableDefinition1,
) => void {
	const setExposureVariables = useSetRecoilState(exposureVariablesState)
	return useCallback(
		(variableDefinition: VariableDefinition1) => {
			setExposureVariables(prev => {
				const exists = prev.find(i => i.id === variableDefinition.id)
				return !exists
					? [...prev, variableDefinition]
					: [
							...prev.filter(i => i.id !== variableDefinition.id),
							variableDefinition,
					  ]
			})
		},
		[setExposureVariables],
	)
}

export function useResetExposureVariables(): Resetter {
	return useResetRecoilState(exposureVariablesState)
}
