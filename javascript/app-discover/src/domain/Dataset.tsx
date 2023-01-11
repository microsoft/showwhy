/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTableBundle, useTableBundleOutput } from '@datashaper/app-framework'
import { Verb } from '@datashaper/schema'
import type { Step, StepInput } from '@datashaper/workflow'
import { Workflow } from '@datashaper/workflow'
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	useRecoilValue,
	useRecoilValueLoadable,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

import { VariableNature } from '../domain/VariableNature.js'
import {
	AllCorrelationsState,
	DatasetNameState,
	DatasetState,
	DerivedMetadataState,
	MetadataState,
	TableState,
	unsetPrecalculatedCorrelations,
} from '../state/index.js'
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

export function useDatasetLoader() {
	const datasetName = useRecoilValue(DatasetNameState)
	const resetDataset = useResetRecoilState(DatasetState)
	const setMetadataState = useSetRecoilState(MetadataState)
	const setDatasetNameState = useSetRecoilState(DatasetNameState)
	const setTable = useSetRecoilState(TableState)

	const datatable = useTableBundle(datasetName)
	const datatableOutput = useTableBundleOutput(datatable)

	const [inputTable, setInputTable] = useState<ColumnTable | undefined>()
	const workflow = useWorkflow(inputTable)

	const tbl = datatableOutput?.table

	useEffect(
		function populateTableAndMetadata() {
			setInputTable(tbl)
			if (tbl != null) {
				const metadata = inferMissingMetadataForTable(tbl)
				setMetadataState(metadata)
			}
		},
		[setInputTable, tbl, setMetadataState],
	)

	useEffect(
		function listenToWorkflowOutput() {
			const sub = workflow
				.read$()
				?.subscribe(t => setTable(t?.table ?? table([])))
			return () => sub.unsubscribe()
		},
		[workflow, setTable],
	)

	return useCallback(
		function loadTable(name: string) {
			// Clear old state
			resetDataset()
			unsetPrecalculatedCorrelations()
			// Set the new state
			setDatasetNameState(name)
		},
		[setDatasetNameState, resetDataset],
	)
}

function useWorkflow(table: ColumnTable | undefined): Workflow {
	const steps = useDataProcessingSteps()
	return useMemo<Workflow>(() => {
		const res = new Workflow()
		res.input = { id: '', table }
		steps.forEach(s => res.addStep(s))
		return res
	}, [steps, table])
}

function useDataProcessingSteps(): StepInput[] {
	const metadata = useRecoilValue(MetadataState)
	return useMemo<StepInput[]>(() => {
		const result: StepInput[] = []
		metadata.forEach(metadatum => {
			if (
				metadatum.nature === VariableNature.CategoricalNominal &&
				metadatum.min != null &&
				metadatum.max != null
			) {
				result.push({
					verb: Verb.Onehot,
					args: {
						column: metadatum.columnName,
						prefix: `${metadatum.columnName}: `,
						preserveSource: true,
					},
				})
			}
		})
		return result
	}, [metadata])
}

export function createDatasetFromTable(
	key: string,
	name: string,
	metadata: CausalVariable[],
	inputTable: ColumnTable | undefined,
) {
	const variables = createVariablesFromTable(key, inputTable, metadata)
	return {
		key,
		name,
		variables,
		table: inputTable ?? table({}),
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
	const datasetName = useRecoilValue(DatasetNameState)
	const createExport = () => {
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
			metadata: outputMetadata,
			correlations,
		}
	}

	return createExport
}
