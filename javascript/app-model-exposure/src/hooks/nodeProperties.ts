/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'

import { useDefinitions } from '../state/definitions.js'
import { useEstimators } from '../state/estimators.js'
import { CausalModelLevel } from '../types/causality/CausalModelLevel.js'
import type { Estimator } from '../types/estimators/Estimator.js'
import type { AlternativeModels } from '../types/experiments/AlternativeModels.js'
import type { Definition } from '../types/experiments/Definition.js'
import { useAlternativeModels } from './causalFactors.js'
import { useOutputTable } from './useOutputTable.js'

export function useNodeProperties(): {
	definitions: Definition[]
	estimators: Estimator[]
	maximumLevel: AlternativeModels
	minimumModel: AlternativeModels
	intermediateLevel: AlternativeModels
	unadjustedModel: AlternativeModels
} {
	const outputTable = useOutputTable()
	const definitions = useDefinitions()
	const estimators = useEstimators()

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
			definitions,
			estimators,
			maximumLevel: filterModel(maximumLevel),
			minimumModel: filterModel(minimumModel),
			intermediateLevel: filterModel(intermediateLevel),
			unadjustedModel: filterModel(unadjustedModel),
		}
	}, [
		estimators,
		maximumLevel,
		minimumModel,
		intermediateLevel,
		unadjustedModel,
		definitions,
		filterModel,
	])
}
