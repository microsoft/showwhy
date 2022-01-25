/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	OrchestatorOnUpdateHandler,
	OrchestratorHandler,
	OrchestratorOnStartHandler,
} from './orchestrator'
import { Orchestrator } from '~classes'
import { OrchestratorType } from '~types'

const orchestrators: Partial<Record<OrchestratorType, Orchestrator<unknown>>> =
	{}

function getOrchestrator<UpdateStatus>(
	type: OrchestratorType,
	onStart?: OrchestratorOnStartHandler | undefined,
	onUpdate?: OrchestatorOnUpdateHandler<UpdateStatus> | undefined,
	onComplete?: OrchestratorHandler | undefined,
	onCancel?: OrchestratorHandler | undefined,
) {
	const existing = orchestrators[type]

	if (!existing) {
		const newOrchestrator = new Orchestrator(
			onStart,
			onUpdate,
			onComplete,
			onCancel,
		)

		orchestrators[type] = newOrchestrator as Orchestrator<unknown>

		return newOrchestrator
	}

	return existing
}

export function getEstimatorOrchestrator<UpdateStatus>(
	onStart?: OrchestratorOnStartHandler | undefined,
	onUpdate?: OrchestatorOnUpdateHandler<UpdateStatus> | undefined,
	onComplete?: OrchestratorHandler | undefined,
	onCancel?: OrchestratorHandler | undefined,
): Orchestrator<UpdateStatus> {
	return getOrchestrator(
		OrchestratorType.Estimator,
		onStart,
		onUpdate,
		onComplete,
		onCancel,
	)
}

export function getConfidenceOrchestrator<UpdateStatus>(
	onStart?: OrchestratorOnStartHandler | undefined,
	onUpdate?: OrchestatorOnUpdateHandler<UpdateStatus> | undefined,
	onComplete?: OrchestratorHandler | undefined,
	onCancel?: OrchestratorHandler | undefined,
): Orchestrator<UpdateStatus> {
	return getOrchestrator(
		OrchestratorType.ConfidenceInterval,
		onStart,
		onUpdate,
		onComplete,
		onCancel,
	)
}
