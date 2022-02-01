/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import {
	atom,
	atomFamily,
	DefaultValue,
	Resetter,
	selectorFamily,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { Definition, ProjectFile, VariableDefinition, Maybe } from '~types'

const modelVariablesState = atomFamily<Maybe<Definition>, Maybe<string>>({
	key: 'model-variables',
	default: {},
})

const keys = atom<string[]>({
	key: 'model-var-keys',
	default: [],
})

export const useSetModelVariableSelector = selectorFamily({
	key: 'model-variable-access',
	get:
		(key: Maybe<string>) =>
		({ get }) =>
			get(modelVariablesState(key)),
	set:
		(key: Maybe<string>) =>
		({ set }, newValue: Maybe<Definition | DefaultValue>) => {
			set<Maybe<Definition>>(modelVariablesState(key), newValue)
			set(keys, prev => {
				if (key && !prev.includes(key)) {
					return [...prev, key]
				}
				return prev
			})
		},
})

export function useSetModelVariables(
	key: Maybe<string>,
): SetterOrUpdater<Maybe<Definition>> {
	return useSetRecoilState(useSetModelVariableSelector(key))
}

export function useModelVariables(key: Maybe<string>): Maybe<Definition> {
	return useRecoilValue(useSetModelVariableSelector(key))
}

export const allModelVariables = selectorFamily({
	key: 'all-model-variables',
	get:
		(ids: { id: string; type: string }[]) =>
		({ get }) => {
			return ids.map(file => {
				return get(modelVariablesState(file.id))?.[file.type]
			})
		},
})

export function useAllModelVariables(
	projectFiles: ProjectFile[],
	type: string,
): VariableDefinition[][] {
	const obj = projectFiles.map(x => {
		return { id: x.id || '', type }
	})
	return useRecoilValue(allModelVariables(obj)) as VariableDefinition[][]
}

export function useResetModelVariables(): Resetter {
	const reset = useResetRecoilState
	const setTableState = useSetRecoilState(keys)
	const ids = useRecoilValue(keys)
	return useCallback(() => {
		ids.forEach(id => reset(modelVariablesState(id)))
		setTableState([])
	}, [ids, reset, setTableState])
}
