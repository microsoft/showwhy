/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FetchApiInteractor } from '../FetchApiInteractor'
import type { Maybe } from '@showwhy/types'
import type {
	OrchestatorOnUpdateHandler,
	OrchestratorHandler,
	OrchestratorOnStartHandler,
} from './Orchestrator'
import { Orchestrator } from './Orchestrator'
import { OrchestratorType } from './OrchestratorType'

const orchestrators: Partial<Record<OrchestratorType, Orchestrator<unknown>>> =
	{}

function getOrchestrator<UpdateStatus>(
	type: OrchestratorType,
	apiInteractor: FetchApiInteractor,
	onStart?: Maybe<OrchestratorOnStartHandler>,
	onUpdate?: Maybe<OrchestatorOnUpdateHandler<UpdateStatus>>,
	onComplete?: Maybe<OrchestratorHandler>,
	onCancel?: Maybe<OrchestratorHandler>,
) {
	const existing = orchestrators[type]

	if (!existing) {
		const newOrchestrator = new Orchestrator(
			apiInteractor,
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
	apiInteractor: FetchApiInteractor,
	onStart?: Maybe<OrchestratorOnStartHandler>,
	onUpdate?: Maybe<OrchestatorOnUpdateHandler<UpdateStatus>>,
	onComplete?: Maybe<OrchestratorHandler>,
	onCancel?: Maybe<OrchestratorHandler>,
): Orchestrator<UpdateStatus> {
	return getOrchestrator(
		OrchestratorType.Estimator,
		apiInteractor,
		onStart,
		onUpdate,
		onComplete,
		onCancel,
	)
}

export function getConfidenceOrchestrator<UpdateStatus>(
	apiInteractor: FetchApiInteractor,
	onStart?: Maybe<OrchestratorOnStartHandler>,
	onUpdate?: Maybe<OrchestatorOnUpdateHandler<UpdateStatus>>,
	onComplete?: Maybe<OrchestratorHandler>,
	onCancel?: Maybe<OrchestratorHandler>,
): Orchestrator<UpdateStatus> {
	return getOrchestrator(
		OrchestratorType.ConfidenceInterval,
		apiInteractor,
		onStart,
		onUpdate,
		onComplete,
		onCancel,
	)
}
