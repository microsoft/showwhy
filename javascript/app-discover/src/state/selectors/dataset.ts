/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Verb } from '@datashaper/schema'
import type { StepInput } from '@datashaper/workflow'
import { Workflow } from '@datashaper/workflow'
import { DefaultValue, selector, selectorFamily } from 'recoil'
import { from } from 'rxjs'

import type { CausalVariable } from '../../domain/CausalVariable.js'
import { inferMissingMetadataForColumn } from '../../domain/CausalVariable.js'
import type { Dataset } from '../../domain/Dataset.js'
import { createDatasetFromTable } from '../../domain/Dataset.js'
import { VariableNature } from '../../domain/VariableNature.js'
import {
	DatasetNameState,
	DEFAULT_PIPELINE_TABLE_NAME,
	MetadataState,
	TableState,
} from '../atoms/index.js'

export const DerivedMetadataState = selector<CausalVariable[]>({
	key: 'DerivedMetadataState',
	get({ get }) {
		const metadata = get(MetadataState)
		const table = get(TableState)
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

const tableProcessingStepsState = selector<StepInput[]>({
	key: 'TableProcessingSteps',
	get({ get }) {
		const metadata = get(MetadataState)
		const result: StepInput[] = []
		let first = true
		metadata.forEach(metadatum => {
			if (metadatum.nature === VariableNature.CategoricalNominal) {
				const recodedColumnName = `${metadatum.columnName}` // (recoded)`;
				result.push({
					verb: Verb.Recode,
					input: first ? 'source' : undefined,
					args: {
						column: metadatum.columnName,
						to: recodedColumnName,
						mapping: metadatum.mapping,
					},
				})

				result.push({
					verb: Verb.Onehot,
					args: {
						column: recodedColumnName,
					},
				})
				first = false
			}
		})

		return result
	},
})

export const workflowState = selector<Workflow | undefined>({
	key: 'ProcessedTableState',
	get({ get }) {
		const steps = get(tableProcessingStepsState)
		const table = get(TableState)
		const workflow = new Workflow()
		workflow.defaultInput = from([{ id: 'source', table }])
		steps.forEach(s => workflow.addStep(s))
		return table != null ? workflow : undefined
	},
})

export const DatasetState = selector<Dataset>({
	key: 'DatasetState',
	get({ get }) {
		const datasetName = get(DatasetNameState)
		const metadata = get(MetadataState)
		const derivedMetadata = get(DerivedMetadataState)
		const table = get(TableState)
		const allMetadata = [...metadata, ...derivedMetadata]
		const dataset = createDatasetFromTable(
			DEFAULT_PIPELINE_TABLE_NAME,
			datasetName,
			allMetadata,
			table,
		)
		return dataset
	},
	set({ reset }, newValue: Dataset | DefaultValue) {
		if (newValue instanceof DefaultValue) {
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
