/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const selectedTableNameState = atom<string | undefined>({
	key: 'selected-table-name',
	default: undefined,
})

export function useSelectedTableName(): string | undefined {
	return useRecoilValue(selectedTableNameState)
}

export function useSetSelectedTableName(): SetterOrUpdater<string | undefined> {
	return useSetRecoilState(selectedTableNameState)
}

export function useResetSelectedTableName(): Resetter {
	return useResetRecoilState(selectedTableNameState)
}
