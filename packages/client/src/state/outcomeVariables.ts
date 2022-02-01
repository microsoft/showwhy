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

export const outcomeVariablesState = atom<VariableDefinition1[]>({
	key: 'outcome-variables-state',
	default: [],
})

export function useOutcomeVariables(): VariableDefinition1[] {
	return useRecoilValue(outcomeVariablesState)
}

export function useSetOutcomeVariables(): SetterOrUpdater<
	VariableDefinition1[]
> {
	return useSetRecoilState(outcomeVariablesState)
}

export function useSetOrUpdateOutcomeVariables(): (
	variableDefinition: VariableDefinition1,
) => void {
	const setOutcomeVariables = useSetRecoilState(outcomeVariablesState)
	return useCallback(
		(variableDefinition: VariableDefinition1) => {
			setOutcomeVariables(prev => {
				const exists = prev.find(i => i.id === variableDefinition.id)
				return !exists
					? [...prev, variableDefinition]
					: [
							...prev.filter(i => i.id !== variableDefinition.id),
							variableDefinition,
					  ]
			})
		},
		[setOutcomeVariables],
	)
}

export function useResetOutcomeVariables(): Resetter {
	return useResetRecoilState(outcomeVariablesState)
}
