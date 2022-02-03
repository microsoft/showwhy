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

export const populationVariablesState = atom<VariableDefinition1[]>({
	key: 'population-variables-state',
	default: [],
})

export function usePopulationVariables(): VariableDefinition1[] {
	return useRecoilValue(populationVariablesState)
}

export function useSetPopulationVariables(): SetterOrUpdater<
	VariableDefinition1[]
> {
	return useSetRecoilState(populationVariablesState)
}

export function useSetOrUpdatePopulationVariables(): (
	variableDefinition: VariableDefinition1,
) => void {
	const setPopulationVariables = useSetRecoilState(populationVariablesState)
	return useCallback(
		(variableDefinition: VariableDefinition1) => {
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