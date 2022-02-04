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

export const populationVariablesState = atom<VariableDefinition[]>({
	key: 'population-variables-state',
	default: [],
})

export function usePopulationVariables(): VariableDefinition[] {
	return useRecoilValue(populationVariablesState)
}

export function useSetPopulationVariables(): SetterOrUpdater<
	VariableDefinition[]
> {
	return useSetRecoilState(populationVariablesState)
}

export function useSetOrUpdatePopulationVariables(): (
	variableDefinition: VariableDefinition,
) => void {
	const setPopulationVariables = useSetRecoilState(populationVariablesState)
	return useCallback(
		(variableDefinition: VariableDefinition) => {
			setPopulationVariables(prev => {
				const exists = prev.find(i => i.id === variableDefinition.id)
				return !exists
					? [...prev, variableDefinition]
					: [
							...prev.filter(i => i.id !== variableDefinition.id),
							variableDefinition,
					  ]
			})
		},
		[setPopulationVariables],
	)
}

export function useResetPopulationVariables(): Resetter {
	return useResetRecoilState(populationVariablesState)
}
