/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import type { ColumnMapping } from '../types.js'

export const ColumnMappingState = atom<ColumnMapping>({
	key: 'ColumnMappingState',
	default: {
		unit: '',
		date: '',
		value: '',
		treated: '',
	},
})

export function useColumnMappingValueState(): ColumnMapping {
	return useRecoilValue(ColumnMappingState)
}

export function useSetColumnMappingState(): SetterOrUpdater<ColumnMapping> {
	return useSetRecoilState(ColumnMappingState)
}

export function useColumnMappingState(): [
	ColumnMapping,
	SetterOrUpdater<ColumnMapping>,
] {
	return useRecoilState(ColumnMappingState)
}
