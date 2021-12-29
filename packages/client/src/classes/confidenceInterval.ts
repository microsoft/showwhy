/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Orchestrator } from '~classes'
import { StatusType } from '~enums'
import { OrchestratorRun } from '~interfaces'
import { buildSignificanceTestsNode } from '~resources'

export class ConfidenceInterval implements OrchestratorRun {
	orchestrator: Orchestrator

	constructor(
		onStart?: (...args) => void,
		onUpdate?: (...args) => void,
		onComplete?: (...args) => void,
		onCancel?: (...args) => void,
	) {
		this.orchestrator = new Orchestrator()
		this.orchestrator.setOnStart(onStart)
		this.orchestrator.setOnUpdate(onUpdate)
		this.orchestrator.setOnComplete(onComplete)
		this.orchestrator.setOnCancel(onCancel)
	}

	async execute(taskIds: string[]): Promise<void> {
		const nodes = buildSignificanceTestsNode(taskIds)

		if (!nodes) return
		await this.orchestrator.execute(nodes, StatusType.Significance)
	}

	async cancel(): Promise<void> {
		await this.orchestrator.cancel()
	}
}
