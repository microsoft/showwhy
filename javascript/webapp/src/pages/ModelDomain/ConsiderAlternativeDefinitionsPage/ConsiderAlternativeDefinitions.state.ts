/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Definition, Maybe } from '@showwhy/types'
import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'

const state = atom<Maybe<Definition>>({
	key: 'definition-store',
	default: undefined,
})

export function useDefinitionToEditState(): Maybe<Definition> {
	return useRecoilValue(state)
}

export function useSetDefinitionToEditState(): SetterOrUpdater<
	Maybe<Definition>
> {
	return useSetRecoilState(state)
}

export function useDefinitionToEdit(): [
	Maybe<Definition>,
	SetterOrUpdater<Maybe<Definition>>,
] {
	return [useDefinitionToEditState(), useSetDefinitionToEditState()]
}
