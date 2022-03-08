/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { csv } from 'd3-fetch'
import isNull from 'lodash/isNull'
import { useEffect, useMemo, useState } from 'react'

import { useDefaultRun } from '~hooks'
import { useDefaultDatasetResult } from '~state'
import type { Specification, SpecificationCurveConfig } from '~types'

export function useLoadSpecificationData(): Specification[] {
	const [data, setData] = useState<Specification[]>([])
	const defaultRun = useDefaultRun()
	const defaultDatasetResult = useDefaultDatasetResult()

	useEffect(() => {
		if (defaultRun && defaultRun.result?.length) {
			const result = defaultRun.result.map((x: any, index) => {
				const n = { ...x, Specification_ID: index + 1 }
				return row2spec(n)
			}) as Specification[]
			const newResult = result
				?.sort(function (a, b) {
					return a?.estimatedEffect - b?.estimatedEffect
				})
				.map((x, index) => ({ ...x, id: index + 1 }))

			setData(newResult)
		} else if (!defaultRun) {
			if (defaultDatasetResult) {
				const f = async () => {
					try {
						const result = await csv(defaultDatasetResult?.url, row2spec)
						setData(result.map((x, index) => ({ ...x, id: index + 1 })))
					} catch (err) {
						setData([])
					}
				}
				f()
			}
		}
	}, [setData, defaultRun, defaultDatasetResult])
	return data
}

// eslint-disable-next-line
function row2spec(d: any): Specification {
	return {
		id: +d.Specification_ID,
		population: d.population_name,
		treatment: d.treatment,
		outcome: d.outcome,
		causalModel: d.causal_model,
		estimator: d.estimator,
		estimatorConfig: d.estimator_config,
		estimatedEffect: +d.estimated_effect,
		causalModelSHAP: +d.shap_causal_model,
		estimatorSHAP: +d.shap_estimator,
		populationSHAP: +d.shap_population_name,
		treatmentSHAP: +d.shap_treatment,
		refuterPlaceboTreatment: isNull(d.refuter_placebo_treatment)
			? null
			: +d.refuter_placebo_treatment,
		refuterDataSubset: isNull(d.refuter_data_subset)
			? null
			: +d.refuter_data_subset,
		refuterRandomCommonCause: isNull(d.refuter_random_common_cause)
			? null
			: +d.refuter_random_common_cause,
		refuterBootstrap: isNull(d.refuter_bootstrap) ? null : +d.refuter_bootstrap,
		populationType: d.population_type,
		treatmentType: d.treatment_type,
		outcomeType: d.outcome_type,
		c95Upper: d.upper_bound,
		c95Lower: d.lower_bound,
		refutationResult: d.refutation_result,
		taskId: d.task_id,
	}
}

export function useDefaultCurveConfig(): SpecificationCurveConfig {
	return useMemo(
		() => ({
			medianLine: true,
			meanLine: true,
			shapTicks: false,
			inactiveFeatures: [],
			inactiveSpecifications: [],
		}),
		[],
	)
}

// these functions hard-code data columns in the current model
// it is possible we may want more flexibility/configurability/discoverability
// in the future
const FEATURE_COLUMNS = ['causalModel', 'estimator', 'population', 'treatment']

const SHAP_COLUMNS = [
	'causalModelSHAP',
	'estimatorSHAP',
	'populationSHAP',
	'treatmentSHAP',
]

/**
 * Returns the standard columns to plot for specification features.
 * @returns
 */
export function useSpecificationFeatureColumns(): string[] {
	return FEATURE_COLUMNS
}

/**
 * Returns the standard columns to plot for SHAP model influence of features.
 * @returns
 */
export function useSpecificationSHAPColumns(): string[] {
	return SHAP_COLUMNS
}

/**
 * Returns a list of the unique feature values for the standard columns.
 * In other words, this is a list of rows for the dot plot.
 * @param data
 */
export function useUniqueFeatures(data: Specification[]): string[] {
	const columns = useSpecificationFeatureColumns()
	return useMemo(() => {
		const unique = new Set<{
			column: string
			value: string
			sort: string
		}>()
		data.forEach(row => {
			columns.forEach(col => {
				const val = (row as any)[col]
				unique.add({
					column: col,
					value: `${val}`,
					sort: `${col} - ${val}`,
				})
			})
		})
		const sorted = Array.from(unique.values()).sort((a, b) =>
			a.sort.localeCompare(b.sort),
		)
		return Array.from(new Set(sorted.map(item => item.value)))
	}, [data, columns])
}
