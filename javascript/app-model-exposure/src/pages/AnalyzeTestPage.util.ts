/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableContainer } from '@datashaper/tables'
import { fromCSV } from 'arquero'
import type { SetterOrUpdater } from 'recoil'

import type { Estimator } from '../types/estimators/Estimator.js'
import { EstimatorGroup } from '../types/estimators/EstimatorGroup.js'
import { EstimatorType } from '../types/estimators/EstimatorType.js'
import type { PrimarySpecificationConfig } from '../types/experiments/PrimarySpecificationConfig.js'
import type { Maybe, Setter } from '../types/primitives.js'
import {
	estimatorRanking,
	ESTIMATORS_SHORT_DESCRIPTION,
} from './AnalyzeTestPage.constants.js'
import { BatchUpdateAction } from './AnalyzeTestPage.types.js'

/* eslint-disable */
const defaultEstimatorRanking = estimatorRanking.reduce((acc, curr) => {
	acc[curr.key] = curr.value
	return acc
}, {} as { [key: string]: number })

export function getEstimatorByRanking(
	estimators: EstimatorType[],
): EstimatorType {
	const ranking = estimators.map(
		(estimator) => defaultEstimatorRanking[estimator],
	) as number[]
	const min = Math.min(...ranking)
	const index = ranking.indexOf(min)
	return estimators[index] as EstimatorType
}

export function changeDefaultEstimator(
	setDefaultEstimator: Setter<Maybe<EstimatorType>>,
	setPrimarySpecificationConfig: SetterOrUpdater<PrimarySpecificationConfig>,
	type: EstimatorType,
): void {
	setDefaultEstimator(type)
	setPrimarySpecificationConfig((prev: PrimarySpecificationConfig) => ({
		...prev,
		type,
	}))
}

export const getShortDescriptionByType = (type: string): string => {
	switch (type) {
		case EstimatorType.LinearDoublyRobustLearner:
			return ESTIMATORS_SHORT_DESCRIPTION.linearDoublyRobustLearner
		case EstimatorType.ForestDoublyRobustLearner:
			return ESTIMATORS_SHORT_DESCRIPTION.forestDoublyRobustLearner
		case EstimatorType.LinearDoubleMachineLearning:
			return ESTIMATORS_SHORT_DESCRIPTION.linearDoubleMachineLearning
		case EstimatorType.ForestDoubleMachineLearning:
			return ESTIMATORS_SHORT_DESCRIPTION.forestDoubleMachineLearning
		case EstimatorType.LinearRegression:
			return ESTIMATORS_SHORT_DESCRIPTION.linearRegression
		case EstimatorType.InversePropensityWeighting:
			return ESTIMATORS_SHORT_DESCRIPTION.inversePropensityWeighting
		case EstimatorType.PropensityScoreMatching:
			return ESTIMATORS_SHORT_DESCRIPTION.propensityScoreMatching
		case EstimatorType.PropensityScoreStratification:
			return ESTIMATORS_SHORT_DESCRIPTION.propensityScoreStratification
		case EstimatorGroup.Exposure:
			return ESTIMATORS_SHORT_DESCRIPTION.exposure
		case EstimatorGroup.Outcome:
			return ESTIMATORS_SHORT_DESCRIPTION.outcome
		default:
			return ''
	}
}

export function batchUpdate(
	action: BatchUpdateAction,
	estimators: Estimator[],
	setEstimators: SetterOrUpdater<Estimator[]>,
): void {
	switch (action) {
		case BatchUpdateAction.Add:
			setEstimators((prev: Estimator[]) => [
				...prev,
				...estimators.filter(
					(estimator) => !prev.map((e) => e.type).includes(estimator.type),
				),
			])
			break
		case BatchUpdateAction.Delete:
			setEstimators((prev: any) =>
				prev.filter(
					(estimator: Estimator) =>
						!estimators.map((e) => e.type).includes(estimator.type),
				),
			)
			break
		default:
			return
	}
}

export async function getOutputTable(): Promise<TableContainer> {
	const result = await fetch('/data/output_table.csv').then((r) => r.text())
	const table = fromCSV(result)
	return {
		id: 'output_table.csv',
		table,
	}
}
