/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { createTableStore } from '@data-wrangling-components/core'
import { table } from 'arquero'
import { atom } from 'recoil'

import type { CausalVariable } from '../../domain/CausalVariable.js'

export const DEFAULT_INPUT_TABLE_NAME = 'original-data'
export const DEFAULT_PREPROCESSED_TABLE_NAME = 'processed-data'
export const DEFAULT_PIPELINE_TABLE_NAME = 'pipeline-table'
export const DEFAULT_DATASET_NAME = 'Causal Dataset'

export const TableStoreState = atom({
	key: 'TableStoreState',
	default: createTableStore([
		{ id: DEFAULT_INPUT_TABLE_NAME, table: table({}) },
	]),
})

export const PreprocessingPipelineState = atom<Step[]>({
	key: 'PreprocessingPipeline',
	default: [],
})

export const MetadataState = atom<CausalVariable[]>({
	key: 'MetadataState',
	default: [],
})

export const DatasetNameState = atom({
	key: 'DatasetNameState',
	default: DEFAULT_DATASET_NAME,
})
