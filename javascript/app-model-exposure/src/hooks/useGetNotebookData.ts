/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { csv } from 'd3-fetch'
import { useCallback } from 'react'

import { OUTPUT_FILE_NAME } from '../pages/AnalyzeTestPage.constants.js'
import { api } from '../resources/api.js'
import { useDefaultDatasetResult } from '../state/defaultDatasetResult.js'
import { useEstimateEffectResponse } from '../state/estimateEffectResponse.js'
import { useSignificanceTest } from '../state/significanceTests.js'
import type { EstimateIdentifier } from '../types/api/EstimateEffectStatus.js'
import type { NotebookRequest } from '../types/api/NotebookRequest.js'
import type { Maybe } from '../types/primitives.js'
import { returnConfidenceIntervalMapping } from '../utils/confidenceIntervalRequest.js'
import { returnRefutationMapping } from '../utils/refutationRequest.js'
import { useReturnDefaultResponse } from './defaultResponses.js'
import { useDefaultRun } from './runHistory.js'
import { useEstimateProps } from './useEstimateProps.js'

export function useGetNotebookData(): () => Promise<Maybe<Blob>> {
	const estimateProps = useEstimateProps(OUTPUT_FILE_NAME)
	const defaultRun = useDefaultRun()
	const significanceTest = useSignificanceTest()
	const defaultDatasetResult = useDefaultDatasetResult()
	const estimateResponses = useEstimateEffectResponse()
	const defaultEstimateResponse = useReturnDefaultResponse(
		estimateResponses,
		defaultRun?.id,
	)

	return useCallback(async () => {
		if (!estimateProps) return

		const taskIdsSignificance = significanceTest.find(
			(x) => x.taskId === defaultRun?.id,
		)?.taskIds

		let results =
			defaultEstimateResponse?.results?.filter((x) =>
				taskIdsSignificance?.includes(x.id),
			) || ([] as EstimateIdentifier[])
		if (!defaultEstimateResponse && defaultDatasetResult) {
			results =
				(await csv(defaultDatasetResult?.url, (x: unknown) => {
					return x as EstimateIdentifier
				})) || []
		}

		const mapping = returnRefutationMapping(
			defaultEstimateResponse?.results,
			defaultRun?.estimators,
		)

		const ids = returnConfidenceIntervalMapping(
			defaultEstimateResponse?.results,
			defaultRun?.estimators,
		)

		const requestData = {
			estimate_effect_params: estimateProps,
			refuter_params: { num_simulations_map: Object.fromEntries(mapping) }, //FIXTHIS
			significance_test_params: { filter_by: results },
			confidence_interval_params: { estimate_execution_ids: ids },
		} as NotebookRequest
		// eslint-disable-next-line
		const response = await api.generateNotebook(requestData)
		const type = { type: 'application/json' }
		return new Blob([JSON.stringify(response)], type)
	}, [
		estimateProps,
		defaultRun,
		defaultEstimateResponse,
		significanceTest,
		defaultDatasetResult,
	])
}
