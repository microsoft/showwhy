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

export const controlVariablesState = atom<VariableDefinition[]>({
	key: 'control-variables-state',
	default: [],
})

export function useControlVariables(): VariableDefinition[] {
	return useRecoilValue(controlVariablesState)
}

export function useSetControlVariables(): SetterOrUpdater<
	VariableDefinition[]
> {
	return useSetRecoilState(controlVariablesState)
}

export function useSetOrUpdateControlVariables(): (
	variableDefinition: VariableDefinition,
) => void {
	const setControlVariables = useSetRecoilState(controlVariablesState)
	return useCallback(
		(variableDefinition: VariableDefinition) => {
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
