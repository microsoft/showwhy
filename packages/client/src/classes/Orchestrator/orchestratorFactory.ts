/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	OrchestatorOnUpdateHandler,
	OrchestratorHandler,
	OrchestratorOnStartHandler,
} from './Orchestrator'
import { OrchestratorType } from './OrchestratorType'
import { Orchestrator } from '~classes'
import { Maybe } from '~types'

const orchestrators: Partial<Record<OrchestratorType, Orchestrator<unknown>>> =
	{}

function getOrchestrator<UpdateStatus>(
	type: OrchestratorType,
	onStart?: Maybe<OrchestratorOnStartHandler>,
	onUpdate?: Maybe<OrchestatorOnUpdateHandler<UpdateStatus>>,
	onComplete?: Maybe<OrchestratorHandler>,
	onCancel?: Maybe<OrchestratorHandler>,
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
	onStart?: Maybe<OrchestratorOnStartHandler>,
	onUpdate?: Maybe<OrchestatorOnUpdateHandler<UpdateStatus>>,
	onComplete?: Maybe<OrchestratorHandler>,
	onCancel?: Maybe<OrchestratorHandler>,
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
	onStart?: Maybe<OrchestratorOnStartHandler>,
	onUpdate?: Maybe<OrchestatorOnUpdateHandler<UpdateStatus>>,
	onComplete?: Maybe<OrchestratorHandler>,
	onCancel?: Maybe<OrchestratorHandler>,
): Orchestrator<UpdateStatus> {
	return getOrchestrator(
		OrchestratorType.ConfidenceInterval,
		onStart,
		onUpdate,
		onComplete,
		onCancel,
	)
}
