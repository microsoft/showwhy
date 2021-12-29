/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus, OrchestratorType } from '~enums'
import { NodeRequest, StatusResponse } from '~interfaces'
import {
	executeNode,
	genericCheckStatus,
	returnOrchestratorStatus,
	terminateRun,
} from '~resources'
import { isStatusProcessing, wait } from '~utils'

export class Orchestrator {
	public _onCancel: ((...args) => void) | undefined
	public _onStart: ((...args) => void) | undefined
	public _onUpdate: ((...args) => void) | undefined
	public _onComplete: ((...args) => void) | undefined
	private _orchestratorResponse

	constructor(
		onStart?: ((...args) => void) | undefined,
		onUpdate?: ((...args) => void) | undefined,
		onComplete?: ((...args) => void) | undefined,
		onCancel?: ((...args) => void) | undefined,
	) {
		this._onStart = onStart
		this._onUpdate = onUpdate
		this._onComplete = onComplete
		this._onCancel = onCancel
	}

	get orchestratorResponse(): any {
		return this._orchestratorResponse
	}

	setOrchestratorResponse(res: any): void {
		this._orchestratorResponse = res
	}

	private async getStatus(type: OrchestratorType): Promise<StatusResponse> {
		let status = await returnOrchestratorStatus(
			this.orchestratorResponse.statusQueryGetUri,
		)

		let estimateStatus
		while (isStatusProcessing(status?.runtimeStatus as NodeResponseStatus)) {
			;[status, estimateStatus] = await Promise.all([
				returnOrchestratorStatus(this.orchestratorResponse.statusQueryGetUri),
				genericCheckStatus(status?.instanceId, type),
				wait(3000),
			])

			this._onUpdate && this._onUpdate({ ...status, ...estimateStatus })
		}
		return { ...status, ...estimateStatus } as StatusResponse
	}

	async execute(nodes: NodeRequest, type: OrchestratorType): Promise<void> {
		const response = await executeNode(nodes)
		this.setOrchestratorResponse(response)
		this._onStart && this._onStart(response)
		const status = await this.getStatus(type)
		this._onComplete && this._onComplete(status)
	}

	async cancel(): Promise<void> {
		this.orchestratorResponse &&
			(await terminateRun(this._orchestratorResponse.terminatePostUri))
		this._onCancel && this._onCancel()
	}
}
