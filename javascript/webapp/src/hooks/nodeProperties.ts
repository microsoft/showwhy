/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { AlternativeModels, Definition, Estimator } from '@showwhy/types'
import { CausalModelLevel } from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import { useAlternativeModels, useOutputLast } from '~hooks'
import {
	useConfidenceInterval,
	useDefinitions,
	useEstimators,
	useRefutationCount,
} from '~state'

export function useNodeProperties(): {
	fileName?: string
	definitions: Definition[]
	estimators: Estimator[]
	refutationCount: number
	confidenceInterval: boolean
	maximumLevel: AlternativeModels
	minimumModel: AlternativeModels
	intermediateLevel: AlternativeModels
	unadjustedModel: AlternativeModels
} {
	const outputTable = useOutputLast()
	const definitions = useDefinitions()
	const estimators = useEstimators()
	const refutationCount = useRefutationCount()
	const confidenceInterval = useConfidenceInterval()

	const maximumLevel = useAlternativeModels(CausalModelLevel.Maximum, false)
	const intermediateLevel = useAlternativeModels(
		CausalModelLevel.Intermediate,
		false,
	)
	const minimumModel = useAlternativeModels(CausalModelLevel.Minimum, false)
	const unadjustedModel = useAlternativeModels(
		CausalModelLevel.Unadjusted,
		false,
	)

	const filterDefinitions = useCallback(() => {
		const outputTableColumns = outputTable?.columnNames() || []
		return definitions.filter(d => outputTableColumns.includes(d.column || ''))
	}, [definitions, outputTable])

	const filterModel = useCallback(
		(model: AlternativeModels) => {
			const outputTableColumns = outputTable?.columnNames() || []
			const filtered = {
				confounders: model.confounders.filter(i =>
					outputTableColumns.includes(i),
				),
				exposureDeterminants: model.exposureDeterminants.filter(i =>
					outputTableColumns.includes(i),
				),
				outcomeDeterminants: model.outcomeDeterminants.filter(i =>
					outputTableColumns.includes(i),
				),
			}
			return filtered
		},
		[outputTable],
	)

	return useMemo(() => {
		return {
			definitions: filterDefinitions(),
			estimators,
			refutationCount,
			confidenceInterval,
			maximumLevel: filterModel(maximumLevel),
			minimumModel: filterModel(minimumModel),
			intermediateLevel: filterModel(intermediateLevel),
			unadjustedModel: filterModel(unadjustedModel),
		}
	}, [
		estimators,
		refutationCount,
		confidenceInterval,
		maximumLevel,
		minimumModel,
		intermediateLevel,
		unadjustedModel,
		filterDefinitions,
		filterModel,
	])
}
