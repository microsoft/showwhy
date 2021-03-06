/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	type Orchestrator,
	getEstimatorOrchestrator,
} from '@showwhy/api-client'
import type {
	EstimateEffectStatusResponse,
	NodeResponse,
	RunStatus,
} from '@showwhy/types'
import { useCallback } from 'react'

import {
	useRefutationOptions,
	useUpdateActiveRunHistory,
	useUpdateNodeResponseActiveRunHistory,
} from '~hooks'
import { api } from '~resources'
import { useConfidenceInterval } from '~state'

import { getRunStatus } from '../EstimateCausalEffectPage.utils'

export function useRunEstimate(): () => Orchestrator<EstimateEffectStatusResponse> {
	const updateActive = useUpdateActiveRunHistory()
	const updateNodeResponse = useUpdateNodeResponseActiveRunHistory()
	const hasConfidenceInterval = useConfidenceInterval()
	const refutersLength = useRefutationOptions().length

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
