/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefinitionType } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

const definitionTypeState = atom<DefinitionType>({
	key: 'definition-type-store',
	default: DefinitionType.Population,
})

export function useDefinitionType(): DefinitionType {
	return useRecoilValue(definitionTypeState)
}

export function useSetDefinitionType(): SetterOrUpdater<DefinitionType> {
	return useSetRecoilState(definitionTypeState)
}

export function useResetDefinitionType(): Resetter {
	return useResetRecoilState(definitionTypeState)
}
