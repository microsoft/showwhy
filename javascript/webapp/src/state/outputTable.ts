/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const outputTableState = atom<TableContainer[]>({
	key: 'output-table-store',
	default: [],
	dangerouslyAllowMutability: true,
})

export function useOutputTable(): TableContainer[] {
	return useRecoilValue(outputTableState)
}

export function useSetOutputTable(): SetterOrUpdater<TableContainer[]> {
	return useSetRecoilState(outputTableState)
}

export function useResetOutputTable(): Resetter {
	return useResetRecoilState(outputTableState)
}

export function useOutput(): [
	TableContainer[],
	SetterOrUpdater<TableContainer[]>,
] {
	const output = useOutputTable()
	const setOutput = useSetOutputTable()
	return [output, setOutput]
}
