/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import { atom } from 'recoil'

import type { CausalVariable } from '../../domain/CausalVariable.js'

export const DEFAULT_INPUT_TABLE_NAME = 'original-data'
export const DEFAULT_PREPROCESSED_TABLE_NAME = 'processed-data'
export const DEFAULT_PIPELINE_TABLE_NAME = 'pipeline-table'
export const DEFAULT_DATASET_NAME = 'Causal dataset'

export const TableState = atom<TableContainer | undefined>({
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
