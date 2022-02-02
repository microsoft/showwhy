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

export const controlVariablesState = atom<VariableDefinition1[]>({
	key: 'control-variables-state',
	default: [],
})

export function useControlVariables(): VariableDefinition1[] {
	return useRecoilValue(controlVariablesState)
}

export function useSetControlVariables(): SetterOrUpdater<
	VariableDefinition1[]
> {
	return useSetRecoilState(controlVariablesState)
}

export function useSetOrUpdateControlVariables(): (
	variableDefinition: VariableDefinition1,
) => void {
	const setControlVariables = useSetRecoilState(controlVariablesState)
	return useCallback(
		(variableDefinition: VariableDefinition1) => {
			setControlVariables(prev => {
				const exists = prev.find(i => i.id === variableDefinition.id)
				return !exists
					? [...prev, variableDefinition]
					: [
							...prev.filter(i => i.id !== variableDefinition.id),
							variableDefinition,
					  ]
			})
		},
		[setControlVariables],
	)
}

export function useResetControlVariables(): Resetter {
	return useResetRecoilState(controlVariablesState)
}
