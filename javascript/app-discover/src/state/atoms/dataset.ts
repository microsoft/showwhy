/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { atom } from 'recoil'
import type { Subscription } from 'rxjs'

import type { CausalVariable } from '../../domain/CausalVariable.js'

export const DEFAULT_INPUT_TABLE_NAME = 'original-data'
export const DEFAULT_PREPROCESSED_TABLE_NAME = 'processed-data'
export const DEFAULT_PIPELINE_TABLE_NAME = 'pipeline-table'
export const DEFAULT_DATASET_NAME = 'Causal Dataset'

export const TableState = atom<ColumnTable | undefined>({
	key: 'TableState',
	default: undefined,
})
export const MetadataState = atom<CausalVariable[]>({
	key: 'MetadataState',
	default: [],
})
export const DatasetNameState = atom({
	key: 'DatasetNameState',
	default: DEFAULT_DATASET_NAME,
})
