/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

const definitionsState = atom<ElementDefinition[]>({
	key: 'definitions',
	default: [],
})

export function useDefinitions(): ElementDefinition[] {
	return useRecoilValue(definitionsState)
}

export function useSetDefinitions(): SetterOrUpdater<ElementDefinition[]> {
	return useSetRecoilState(definitionsState)
}

export function useResetDefinitions(): Resetter {
	return useResetRecoilState(definitionsState)
}
