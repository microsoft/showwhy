/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Orchestrator } from '~classes'
import { OrchestratorType } from '~enums'

const orchestrators = {}

function getOrchestrator(
	type: OrchestratorType,
	onStart?: ((...args) => void) | undefined,
	onUpdate?: ((...args) => void) | undefined,
	onComplete?: ((...args) => void) | undefined,
	onCancel?: ((...args) => void) | undefined,
): Orchestrator {
	const existing = orchestrators[type]

	if (!existing) {
		const newOrchestrator = new Orchestrator(
			onStart,
			onUpdate,
			onComplete,
			onCancel,
		)

		orchestrators[type] = newOrchestrator

		return newOrchestrator
	}

	return existing
}

export function getEstimatorOrchestrator(
	onStart?: ((...args) => void) | undefined,
	onUpdate?: ((...args) => void) | undefined,
	onComplete?: ((...args) => void) | undefined,
	onCancel?: ((...args) => void) | undefined,
): Orchestrator {
	return getOrchestrator(
		OrchestratorType.Estimator,
		onStart,
		onUpdate,
		onComplete,
		onCancel,
	)
}

export function getConfidenceOrchestrator(
	onStart?: ((...args) => void) | undefined,
	onUpdate?: ((...args) => void) | undefined,
	onComplete?: ((...args) => void) | undefined,
	onCancel?: ((...args) => void) | undefined,
): Orchestrator {
	return getOrchestrator(
		OrchestratorType.ConfidenceInterval,
		onStart,
		onUpdate,
		onComplete,
		onCancel,
	)
}
