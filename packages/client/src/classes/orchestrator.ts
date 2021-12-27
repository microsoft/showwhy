/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeRequest } from '~interfaces'
import { terminateRun } from '~resources'

export class Orchestrator {
	protected fileUrl = ''
	protected fileName = ''
	protected _orchestratorResponse
	protected _onStart: ((...args) => void) | undefined
	protected _onUpdate: ((...args) => void) | undefined
	protected _onComplete: ((...args) => void) | undefined
	protected _onCancel: ((...args) => void) | undefined

	constructor(
		onStart?: (...args) => void,
		onUpdate?: (...args) => void,
		onComplete?: (...args) => void,
		onCancel?: (...args) => void,
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

	protected async getStatus() {}

	async execute(...args): Promise<void> {}

	async cancel(): Promise<void> {
		this.orchestratorResponse &&
			(await terminateRun(this._orchestratorResponse.terminatePostUri))
		this._onCancel && this._onCancel()
	}
}
