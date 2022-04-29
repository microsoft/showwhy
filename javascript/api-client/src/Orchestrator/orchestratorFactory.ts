/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@showwhy/types'

import type { FetchApiInteractor } from '../FetchApiInteractor.js'
import type {
	OrchestatorOnUpdateHandler,
	OrchestratorHandler,
	OrchestratorOnStartHandler,
} from './Orchestrator.js'
import { Orchestrator } from './Orchestrator.js'
import { OrchestratorType } from './OrchestratorType.js'

const orchestrators: Partial<Record<OrchestratorType, Orchestrator<unknown>>> =
	{}

function deleteOrchestrator(type: OrchestratorType) {
	orchestrators[type] = undefined
}

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

export function getSignificanceOrchestrator<UpdateStatus>(
	apiInteractor: FetchApiInteractor,
	onStart?: Maybe<OrchestratorOnStartHandler>,
	onUpdate?: Maybe<OrchestatorOnUpdateHandler<UpdateStatus>>,
	onComplete?: Maybe<OrchestratorHandler>,
	onCancel?: Maybe<OrchestratorHandler>,
	replace?: Maybe<boolean>,
): Orchestrator<UpdateStatus> {
	const type = OrchestratorType.SignificanceTests
	if (replace) {
		deleteOrchestrator(type)
	}
	return getOrchestrator(
		type,
		apiInteractor,
		onStart,
		onUpdate,
		onComplete,
		onCancel,
	)
}
