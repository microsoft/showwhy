/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const outputTablesState = atom<TableContainer[]>({
	key: 'output-table-store',
	default: [],
	dangerouslyAllowMutability: true,
})

export function useOutputTables(): TableContainer[] {
	return useRecoilValue(outputTablesState)
}

export function useSetOutputTables(): SetterOrUpdater<TableContainer[]> {
	return useSetRecoilState(outputTablesState)
}

export function useResetOutputTables(): Resetter {
	return useResetRecoilState(outputTablesState)
}

export function useOutputs(): [
	TableContainer[],
	SetterOrUpdater<TableContainer[]>,
] {
	const outputs = useOutputTables()
	const setOutputs = useSetOutputTables()
	return [outputs, setOutputs]
}
