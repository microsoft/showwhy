/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Orchestrator } from '@showwhy/api-client'
import { getEstimatorOrchestrator } from '@showwhy/api-client'
import type { EstimateEffectStatusResponse, NodeResponse } from '@showwhy/types'
import { useCallback } from 'react'
import {
	useRefutationLength,
	useUpdateActiveRunHistory,
	useUpdateNodeResponseActiveRunHistory,
} from '~hooks'
import { api } from '~resources'
import { useConfidenceInterval } from '~state'
import type { RunStatus } from '~types'
import { getRunStatus } from '~utils'

export function useRunEstimate(): () => Orchestrator<EstimateEffectStatusResponse> {
	const updateActive = useUpdateActiveRunHistory()
	const updateNodeResponse = useUpdateNodeResponseActiveRunHistory()

	const hasConfidenceInterval = useConfidenceInterval()
	const refutersLength = useRefutationLength()

	const onUpdate = useCallback(
		(status: EstimateEffectStatusResponse) => {
			const updatedStatus = getRunStatus(
				status,
				hasConfidenceInterval,
				refutersLength,
			)

			updateActive(updatedStatus, status?.partial_results)
		},
		[updateActive, hasConfidenceInterval, refutersLength],
	)

	const onComplete = useCallback(() => {
		const updatedStatus = {
			time: {
				end: new Date(),
			},
		} as RunStatus
		updateActive(updatedStatus)
	}, [updateActive])

	const onStart = useCallback(
		(nodeResponse: NodeResponse) => {
			updateNodeResponse(nodeResponse)
		},
		[updateNodeResponse],
	)

	const run = useCallback((): Orchestrator<EstimateEffectStatusResponse> => {
		return getEstimatorOrchestrator(api, onStart, onUpdate, onComplete)
	}, [onUpdate, onComplete, onStart])

	return run
}
