/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableStore } from '@data-wrangling-components/core'
import {
	createPipeline,
	createTableStore,
	Verb,
} from '@data-wrangling-components/core'
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import {
	atom,
	DefaultValue,
	selector,
	selectorFamily,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

import type { CausalVariable } from '../domain/CausalVariable.js'
import {
	createMapFromForeignKey,
	inferMissingMetadataForColumn,
} from '../domain/CausalVariable.js'
import type { Dataset } from '../domain/Dataset.js'
import { createDatasetFromTable } from '../domain/Dataset.js'
import { VariableNature } from '../domain/VariableNature.js'

export const DEFAULT_INPUT_TABLE_NAME = 'original-data'
export const DEFAULT_PREPROCESSED_TABLE_NAME = 'processed-data'
export const DEFAULT_PIPELINE_TABLE_NAME = 'pipeline-table'

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

export const InputTableState = selector<ColumnTable | undefined>({
	key: 'InputTableState',
	async get({ get }) {
		const tableStore = get(TableStoreState)
		const { table } = await tableStore.get(DEFAULT_INPUT_TABLE_NAME)

		return table
	},
})

export const ProcessedArqueroTableState = selector<ColumnTable | undefined>({
	key: 'ProcessedArqueroTableState',
	async get({ get }) {
		const tableStore = get(TableStoreState)
		const metadata = get(MetadataState)
		const originalTable = await tableStore.get(DEFAULT_INPUT_TABLE_NAME)
		const preprocessingPipelineSteps = get(PreprocessingPipelineState)
		const preprocessedTable = tableStore
			.list()
			.includes(DEFAULT_PREPROCESSED_TABLE_NAME)
			? await tableStore.get(DEFAULT_PREPROCESSED_TABLE_NAME)
			: undefined
		if (preprocessedTable) {
			tableStore.set({
				id: DEFAULT_PIPELINE_TABLE_NAME,
				table: preprocessedTable.table,
			})
			tableStore.delete(DEFAULT_PREPROCESSED_TABLE_NAME)
			return preprocessedTable.table
		}

		tableStore.set({
			id: DEFAULT_PIPELINE_TABLE_NAME,
			table: originalTable.table,
		})
		let resultTable = originalTable

		const metadataDerivedPipelineSteps: Step[] = []

		// Convert foreignKeys to mappings1
		const mappedMetadata = await Promise.all(
			metadata.map(async metadatum => {
				let { mapping } = metadatum
				if (metadatum.foreignkey) {
					mapping = await createMapFromForeignKey(
						metadatum.foreignkey,
						tableStore,
					)
				}

				return { mapping, ...metadatum }
			}),
		)

		// Create implied pipeline steps from metadata
		mappedMetadata.forEach(metadatum => {
			if (metadatum.nature === VariableNature.CategoricalNominal) {
				const recodedColumnName = `${metadatum.columnName}` // (recoded)`;
				metadataDerivedPipelineSteps.push({
					verb: Verb.Recode,
					input: DEFAULT_PIPELINE_TABLE_NAME,
					output: DEFAULT_PIPELINE_TABLE_NAME,
					args: {
						column: metadatum.columnName,
						to: recodedColumnName,
						map: metadatum.mapping,
					},
				})

				metadataDerivedPipelineSteps.push({
					verb: Verb.OneHot,
					input: DEFAULT_PIPELINE_TABLE_NAME,
					output: DEFAULT_PIPELINE_TABLE_NAME,
					args: {
						column: recodedColumnName,
					},
				})
			}
		})
		const pipelineSteps = [
			...preprocessingPipelineSteps,
			...metadataDerivedPipelineSteps,
		]

		if (pipelineSteps.length > 0) {
			const pipeline = createPipeline(tableStore)
			pipeline.addAll(pipelineSteps)
			resultTable = await pipeline.run()
		}

		return resultTable.table
	},
})

const MetadataState = atom<CausalVariable[]>({
	key: 'MetadataState',
	default: [],
})

const DerivedMetadataState = selector<CausalVariable[]>({
	key: 'DerivedMetadataState',
	get({ get }) {
		const metadata = get(MetadataState)
		const table = get(ProcessedArqueroTableState)
		if (table === undefined) {
			return []
		}

		const derivedMetadata: CausalVariable[] = []
		metadata.forEach(metadatum => {
			if (metadatum.nature === VariableNature.CategoricalNominal) {
				metadatum.mapping?.forEach(variableMapping => {
					let existingMetadatum = metadata.find(
						(md: CausalVariable) => md.columnName === variableMapping,
					)
					if (existingMetadatum === undefined) {
						existingMetadatum = {
							columnName: variableMapping,
							name: variableMapping,
							nature: VariableNature.Binary,
							columnDataNature: {
								mostLikelyNature: VariableNature.Binary,
								possibleNatures: [VariableNature.Binary],
								uniquePresentValues: [0, 1],
							},
							derivedFrom: [metadatum.columnName],
							mapping: new Map([
								[0, 'False'],
								[1, 'True'],
							]),
						}
					}

					const completedMetadatum = table
						.columnNames()
						.includes(variableMapping)
						? inferMissingMetadataForColumn(
								table,
								variableMapping,
								existingMetadatum,
						  )
						: existingMetadatum
					derivedMetadata.push(completedMetadatum)
				})
			}
		})
		return derivedMetadata
	},
})

export const variableMetadataState = selectorFamily<
	CausalVariable | undefined,
	string
>({
	key: 'variableMetadataState',
	get:
		(columnName: string) =>
		({ get }) => {
			const metadata = get(MetadataState)
			return metadata.find(metadatum => metadatum.columnName === columnName)
		},
	set:
		(columnName: string) =>
		({ get, set }, newValue) => {
			const metadata = get(MetadataState)
			// Remove existing metadata for column
			const newMetadata = metadata.filter(
				metadatum => metadatum.columnName !== columnName,
			)
			if (newValue && !(newValue instanceof DefaultValue)) {
				newMetadata.push(newValue)
			}

			set(MetadataState, newMetadata)
		},
})

export const DEFAULT_DATASET_NAME = 'Causal Dataset'
export const DatasetNameState = atom({
	key: 'DatasetNameState',
	default: DEFAULT_DATASET_NAME,
})

export const DatasetState = selector<Dataset>({
	key: 'DatasetState',
	async get({ get }) {
		const datasetName = get(DatasetNameState)
		const tableStore = get(TableStoreState)
		const metadata = get(MetadataState)
		const derivedMetadata = get(DerivedMetadataState)
		const allMetadata = [...metadata, ...derivedMetadata]
		const dataset = createDatasetFromTable(
			DEFAULT_PIPELINE_TABLE_NAME,
			datasetName,
			tableStore,
			allMetadata,
		)
		return dataset
	},
	set({ set, reset }, newValue: Dataset | DefaultValue) {
		if (newValue instanceof DefaultValue) {
			reset(TableStoreState)
			reset(PreprocessingPipelineState)
			reset(MetadataState)
			reset(DatasetNameState)
			return
		}
		throw new Error(
			'Direct setting of DatasetState is not implemented. Use useDatasetLoader instead.',
		)
	},
})

export const CausalVariablesState = selector<CausalVariable[]>({
	key: 'CausalVariablesState',
	get({ get }) {
		const dataset = get(DatasetState)
		return Array.from(dataset.variables.values())
	},
})

export function useDataset() {
	return useRecoilValue(DatasetState)
}

export function useResetDataset(): () => void {
	return useResetRecoilState(DatasetState)
}

export function useTableStore() {
	return useRecoilValue(TableStoreState)
}

export function useSetTableStore(): (tableStore: TableStore) => void {
	return useSetRecoilState(TableStoreState)
}

export function usePreprocessingPipeline() {
	return useRecoilValue(PreprocessingPipelineState)
}

export function useSetPreprocessingPipeline(): (pipeline: Step[]) => void {
	return useSetRecoilState(PreprocessingPipelineState)
}

export function useMetadata() {
	return useRecoilValue(MetadataState)
}

export function useSetMetadata(): (metadata: CausalVariable[]) => void {
	return useSetRecoilState(MetadataState)
}

export function useDatasetName() {
	return useRecoilValue(DatasetNameState)
}

export function useSetDatasetName(): (name: string) => void {
	return useSetRecoilState(DatasetNameState)
}

export function useDerivedMetadata() {
	return useRecoilValue(DerivedMetadataState)
}

export function useInputTable() {
	return useRecoilValue(InputTableState)
}

export function useProcessedArqueroTable() {
	return useRecoilValue(ProcessedArqueroTableState)
}
