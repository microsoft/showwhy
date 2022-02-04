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
import { VariableDefinition } from '~types'

export const exposureVariablesState = atom<VariableDefinition[]>({
	key: 'exposure-variables-state',
	default: [],
})

export function useExposureVariables(): VariableDefinition[] {
	return useRecoilValue(exposureVariablesState)
}

export function useSetExposureVariables(): SetterOrUpdater<
	VariableDefinition[]
> {
	return useSetRecoilState(exposureVariablesState)
}

export function useSetOrUpdateExposureVariables(): (
	variableDefinition: VariableDefinition,
) => void {
	const setExposureVariables = useSetRecoilState(exposureVariablesState)
	return useCallback(
		(variableDefinition: VariableDefinition) => {
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
