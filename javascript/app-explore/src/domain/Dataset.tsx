/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableStore } from '@data-wrangling-components/core'
import { createTableStore } from '@data-wrangling-components/core'
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { compressSync, strFromU8, strToU8 } from 'fflate'
import {
	useRecoilValue,
	useRecoilValueLoadable,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

import {
	AllCorrelationsState,
	unsetPrecalculatedCorrelations,
} from '../state/CorrelationsState.js'
import {
	DatasetNameState,
	DatasetState,
	DEFAULT_INPUT_TABLE_NAME,
	DEFAULT_PREPROCESSED_TABLE_NAME,
	DerivedMetadataState,
	InputTableState,
	MetadataState,
	PreprocessingPipelineState,
	ProcessedArqueroTableState,
	TableStoreState,
} from '../state/DatasetState.js'
import type { CausalVariable } from './CausalVariable.js'
import {
	createVariablesFromTable,
	inferMissingMetadataForTable,
} from './CausalVariable.js'
import type { RelationshipWithWeight } from './Relationship.js'

export interface Dataset {
	key: string
	name: string
	table: ColumnTable
	variables: Map<string, CausalVariable>
}

export interface Metadatum {
	name: string
	columnName: string
	mapping?: Iterable<[string | number | boolean, string]>
}

export interface DatapackageResource {
	profile: string
	name: string
	data: object | string
}
export interface DatasetDatapackage {
	name: string
	resources: DatapackageResource[]
	metadata: Metadatum[]
	pipeline: Step[]
	correlations?: RelationshipWithWeight[]
}

export default function useDatasetLoader() {
	const resetDataset = useResetRecoilState(DatasetState)
	const setTableStoreState = useSetRecoilState(TableStoreState)
	const setPreprocessingPipelineState = useSetRecoilState(
		PreprocessingPipelineState,
	)
	const setMetadataState = useSetRecoilState(MetadataState)
	const setDatasetNameState = useSetRecoilState(DatasetNameState)

	return {
		loadColumnTable: (name: string, table: ColumnTable) => {
			resetDataset()
			unsetPrecalculatedCorrelations()
			const tableStore = createTableStore()
			tableStore.set({ id: DEFAULT_INPUT_TABLE_NAME, table })
			const metadata = inferMissingMetadataForTable(table)
			setTableStoreState(tableStore)
			setPreprocessingPipelineState([])
			setMetadataState(metadata)
			setDatasetNameState(name)
		},
	}
}

export async function createDatasetFromTable(
	key: string,
	name: string,
	tableStore: TableStore,
	metadata: CausalVariable[],
) {
	const variables = await createVariablesFromTable(key, tableStore, metadata)
	const tableContainer = await tableStore.get(key)
	const mainTable = tableContainer.table ?? table({})
	return {
		key,
		name,
		variables,
		table: mainTable,
	}
}

export function variableForColumnName(dataset: Dataset, columnName: string) {
	return dataset.variables.get(columnName)
}

export function variablesForColumnNames(
	dataset: Dataset,
	columnNames: string[],
) {
	return columnNames
		.map(columnName => variableForColumnName(dataset, columnName))
		.filter((variable): variable is CausalVariable => variable !== undefined)
}

export function useDataPackageExport() {
	const correlations =
		useRecoilValueLoadable(AllCorrelationsState).valueMaybe() || []
	const baseMetadata = useRecoilValue(MetadataState)
	const derivedMetadata = useRecoilValue(DerivedMetadataState)
	const metadata = [...baseMetadata, ...derivedMetadata]
	const pipeline = useRecoilValue(PreprocessingPipelineState)
	const datasetName = useRecoilValue(DatasetNameState)
	const table = useRecoilValue(InputTableState)
	const processedTable = useRecoilValue(ProcessedArqueroTableState)
	const createExport = () => {
		let compressedTable
		if (table) {
			const gzTable = compressSync(strToU8(table?.toJSON()))
			compressedTable = btoa(strFromU8(gzTable, true))
		}

		let compressedProcessedTable
		if (processedTable) {
			const gzTable = compressSync(strToU8(processedTable?.toJSON()))
			compressedProcessedTable = btoa(strFromU8(gzTable, true))
		}

		const outputMetadata = metadata.map(metadatum => ({
			...metadatum,
			mapping:
				metadatum.mapping === undefined
					? undefined
					: Array.from(metadatum.mapping),
		}))

		return {
			profile: 'data-package',
			name: datasetName,
			pipeline,
			metadata: outputMetadata,
			correlations,
			resources: [
				{
					profile: 'arquero-data-resource-compressed',
					name: DEFAULT_INPUT_TABLE_NAME,
					data: compressedTable,
				},
				{
					profile: 'arquero-data-resource-compressed',
					name: DEFAULT_PREPROCESSED_TABLE_NAME,
					data: compressedProcessedTable,
				},
			],
		}
	}

	return createExport
}
