/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OrchestratorType } from './OrchestratorType'
import {
	executeNode,
	genericCheckStatus,
	returnOrchestratorStatus,
	terminateRun,
} from '~resources'
import {
	NodeRequest,
	NodeResponse,
	StatusResponse,
	NodeResponseStatus,
} from '~types'
import { isStatusProcessing, wait } from '~utils'

export type OrchestratorHandler = (...args: unknown[]) => void
export type OrchestratorOnStartHandler = (nodeResponse: NodeResponse) => void
export type OrchestatorOnUpdateHandler<UpdateStatus> = (
	status: UpdateStatus,
) => void

export type OrchestratorResponse = {
	statusQueryGetUri: string
	terminatePostUri: string
}

export class Orchestrator<UpdateStatus> {
	public _onCancel: OrchestratorHandler | undefined
	public _onStart: OrchestratorOnStartHandler | undefined
	public _onUpdate: OrchestatorOnUpdateHandler<UpdateStatus> | undefined
	public _onComplete: OrchestratorHandler | undefined
	private _orchestratorResponse: OrchestratorResponse | undefined

	constructor(
		onStart?: OrchestratorOnStartHandler | undefined,
		onUpdate?: OrchestatorOnUpdateHandler<UpdateStatus> | undefined,
		onComplete?: OrchestratorHandler | undefined,
		onCancel?: OrchestratorHandler | undefined,
	) {
		this._onStart = onStart
		this._onUpdate = onUpdate
		this._onComplete = onComplete
		this._onCancel = onCancel
	}

	get orchestratorResponse(): OrchestratorResponse | undefined {
		return this._orchestratorResponse
	}

	setOrchestratorResponse(res: OrchestratorResponse): void {
		this._orchestratorResponse = res
	}

	private async getStatus(type: OrchestratorType): Promise<StatusResponse> {
		if (this.orchestratorResponse == null) {
			throw new Error('response not available')
		}
		let status = await returnOrchestratorStatus(
			this.orchestratorResponse.statusQueryGetUri,
		)

		let estimateStatus
		while (isStatusProcessing(status?.runtimeStatus as NodeResponseStatus)) {
			[status, estimateStatus] = await Promise.all([
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
		if (this.orchestratorResponse != null) {
			await terminateRun(this.orchestratorResponse.terminatePostUri)
		}
		this._onCancel && this._onCancel()
	}
}
