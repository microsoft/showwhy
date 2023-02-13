/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

import { ApiType } from '../../api-client/FetchApiInteractor.types.js'
import { OUTPUT_FILE_NAME } from '../../pages/AnalyzeTestPage.constants.js'
import { useEstimateEffectResponse } from '../../state/estimateEffectResponse.js'
import { clearStorage } from '../../state/sessionStorage.js'
import { useDefaultRun } from '../runHistory.js'
import { useEstimateProps } from '../useEstimateProps.js'
import {
	useConfidenceRun,
	useRefutationRun,
	useRun,
	useShapRun,
} from './useRunEstimate.js'

export function useRestartEstimate(signal: AbortSignal) {
	const defaultRun = useDefaultRun()
	const run = useRun(undefined, defaultRun, signal)
	const shapRun = useShapRun(signal)
	const confidenceRun = useConfidenceRun(signal)
	const refutationRun = useRefutationRun(signal)
	const estimateProps = useEstimateProps(OUTPUT_FILE_NAME)
	const estimatedEffectResponse = useEstimateEffectResponse()

	return useCallback(
		({
			taskId,
			type,
			_updateId,
		}: {
			taskId: string
			type: ApiType
			_updateId?: string
		}) => {
			const response = estimatedEffectResponse.find((x) => x.taskId === taskId)
			switch (type) {
				case ApiType.EstimateEffect:
					return run(estimateProps, taskId)
				case ApiType.ShapInterpreter:
					return shapRun(
						defaultRun?.estimators.some((x) => x.confidenceInterval),
						_updateId,
						response,
						taskId,
					)
				case ApiType.ConfidenceInterval:
					return confidenceRun(_updateId, response?.results, taskId)
				case ApiType.RefuteEstimate:
					return refutationRun(_updateId, response?.results, taskId)
			}
			clearStorage()
		},
		[
			defaultRun,
			run,
			shapRun,
			confidenceRun,
			refutationRun,
			estimateProps,
			estimatedEffectResponse,
		],
	)
}
