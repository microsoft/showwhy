/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Verb } from '@datashaper/schema'
import type { Step, StepInput } from '@datashaper/workflow'
import { Workflow } from '@datashaper/workflow'
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'
import {
	useRecoilState,
	useRecoilValue,
	useRecoilValueLoadable,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import type { Subscription } from 'rxjs'

import {
	AllCorrelationsState,
	DatasetNameState,
	DatasetState,
	DerivedMetadataState,
	MetadataState,
	TableState,
	TableSubscriptionState,
	unsetPrecalculatedCorrelations,
} from '../state/index.js'
import type { CausalVariable } from './CausalVariable.js'
import {
	createVariablesFromTable,
	inferMissingMetadataForTable,
} from './CausalVariable.js'
import type { RelationshipWithWeight } from './Relationship.js'
import { VariableNature } from './VariableNature.js'

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
	const setMetadataState = useSetRecoilState(MetadataState)
	const setDatasetNameState = useSetRecoilState(DatasetNameState)
	const setTable = useSetRecoilState(TableState)
	const [subscription, setSubscription] = useRecoilState(TableSubscriptionState)

	return useCallback(
		function loadTable(name: string, table: ColumnTable) {
			resetDataset()
			unsetPrecalculatedCorrelations()
			setDatasetNameState(name)
			const metadata = inferMissingMetadataForTable(table)
			setMetadataState(metadata)
			if (subscription) {
				subscription.unsubscribe()
			}
			setSubscription(listenToProcessedTable(table, metadata, setTable))
		},
		[
			resetDataset,
			setMetadataState,
			setDatasetNameState,
			setSubscription,
			setTable,
			subscription,
		],
	)
}

function listenToProcessedTable(
	table: ColumnTable | undefined,
	metadata: CausalVariable[],
	setTable: (table: ColumnTable | undefined) => void,
): Subscription | undefined {
	const steps: StepInput[] = []

	// Create implied pipeline steps from metadata
	let first = true
	metadata.forEach(metadatum => {
		if (metadatum.nature === VariableNature.CategoricalNominal) {
			const recodedColumnName = `${metadatum.columnName}` // (recoded)`;
			steps.push({
				verb: Verb.Recode,
				input: first ? 'source' : undefined,
				args: {
					column: metadatum.columnName,
					to: recodedColumnName,
					mapping: metadatum.mapping,
				},
			})

			steps.push({
				verb: Verb.Onehot,
				args: {
					column: recodedColumnName,
				},
			})
			first = false
		}
	})

	if (steps.length > 0) {
		const flow = new Workflow()
		flow.addInputTable({ id: 'source', table })
		steps.forEach(s => flow.addStep(s))
		const sub = flow
			.outputObservable()
			?.subscribe(tbl => setTable(tbl?.table ?? table))
		setTable(flow.latestOutput()?.table ?? table)
		return sub
	} else {
		setTable(table)
	}
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
