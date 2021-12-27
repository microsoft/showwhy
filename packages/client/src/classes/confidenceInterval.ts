/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Orchestrator } from '~classes'
import { NodeResponseStatus } from '~enums'
import {
	buildSignificanceTestsNode,
	checkSignificanceStatus,
	executeNode,
	returnOrchestratorStatus,
} from '~resources'
import { isStatusProcessing, wait } from '~utils'

export class ConfidenceInterval extends Orchestrator {
	constructor(
		onStart?: (...args) => void,
		onUpdate?: (...args) => void,
		onComplete?: (...args) => void,
		onCancel?: (...args) => void,
	) {
		super(onStart, onUpdate, onComplete, onCancel)
	}

	protected async getStatus() {
		let status = await returnOrchestratorStatus(
			this._orchestratorResponse.statusQueryGetUri,
		)

		let estimateStatus
		while (isStatusProcessing(status?.runtimeStatus as NodeResponseStatus)) {
			[status, estimateStatus] = await Promise.all([
				returnOrchestratorStatus(this._orchestratorResponse.statusQueryGetUri),
				checkSignificanceStatus(status?.instanceId as string),
				wait(3000),
			])
			this._onUpdate && this._onUpdate({ ...status, ...estimateStatus })
		}
		return { ...status, ...estimateStatus }
	}

	async execute(taskIds: string[]): Promise<void> {
		const nodes = buildSignificanceTestsNode(taskIds)

		if (!nodes) return
		this._orchestratorResponse = await executeNode(nodes)
		this._onStart && this._onStart(this.orchestratorResponse)
		const status = await this.getStatus()
		this._onComplete && this._onComplete(status)
	}
}
