/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { OrchestratorType } from './OrchestratorType'
import type { FetchApiInteractor } from '../FetchApiInteractor'
import type {
	NodeRequest,
	NodeResponse,
	StatusResponse,
	NodeResponseStatus,
	OrchestratorStatusResponse,
	Maybe,
} from '../types'
import { isProcessingStatus, wait } from '../utils'

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
	public _onCancel: Maybe<OrchestratorHandler>
	public _onStart: Maybe<OrchestratorOnStartHandler>
	public _onUpdate: Maybe<OrchestatorOnUpdateHandler<UpdateStatus>>
	public _onComplete: Maybe<OrchestratorHandler>
	private _orchestratorResponse: Maybe<OrchestratorResponse>

	public constructor(
		private api: FetchApiInteractor,
		onStart?: Maybe<OrchestratorOnStartHandler>,
		onUpdate?: Maybe<OrchestatorOnUpdateHandler<UpdateStatus>>,
		onComplete?: Maybe<OrchestratorHandler>,
		onCancel?: Maybe<OrchestratorHandler>,
	) {
		this._onStart = onStart
		this._onUpdate = onUpdate
		this._onComplete = onComplete
		this._onCancel = onCancel
	}

	public get orchestratorResponse(): Maybe<OrchestratorResponse> {
		return this._orchestratorResponse
	}

	private async getStatus(type: OrchestratorType): Promise<StatusResponse> {
		if (this.orchestratorResponse == null) {
			throw new Error('response not available')
		}
		let status = await this.api.getOrchestratorStatus(
			this.orchestratorResponse.statusQueryGetUri,
		)

		let estimateStatus: Partial<OrchestratorStatusResponse> | null = null
		while (isProcessingStatus(status?.runtimeStatus as NodeResponseStatus)) {
			;[status, estimateStatus] = await Promise.all([
				this.api.getOrchestratorStatus(
					this.orchestratorResponse.statusQueryGetUri,
				),
				this.api.genericCheckStatus(status?.instanceId, type),
				wait(3000),
			])

			this._onUpdate && this._onUpdate({ ...status, ...estimateStatus } as any)
		}
		return { ...status, ...estimateStatus } as StatusResponse
	}

	async execute(nodes: NodeRequest, type: OrchestratorType): Promise<void> {
		const response = await this.api.executeNode(nodes)
		this._orchestratorResponse = response
		this._onStart && this._onStart(response)
		const status = await this.getStatus(type)
		this._onComplete && this._onComplete(status)
	}

	async cancel(): Promise<void> {
		if (this.orchestratorResponse != null) {
			await this.api.terminateRun(this.orchestratorResponse.terminatePostUri)
		}
		this._onCancel && this._onCancel()
	}
}
