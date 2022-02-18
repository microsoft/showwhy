/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { outputTablePrepState } from './outputTablePrep'

export const outputTableModelVariables = atom<ColumnTable | undefined>({
	key: 'output-table-model-variables',
	default: outputTablePrepState,
	dangerouslyAllowMutability: true,
})

export function useOutputTableModelVariables(): ColumnTable | undefined {
	return useRecoilValue(outputTableModelVariables)
}

export function useSetOutputTableModelVariables(): SetterOrUpdater<
	ColumnTable | undefined
> {
	return useSetRecoilState(outputTableModelVariables)
}

export function useResetOutputTableModelVariables(): Resetter {
	return useResetRecoilState(outputTableModelVariables)
}
