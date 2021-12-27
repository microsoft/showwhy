/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { buildLoadNode } from './prepareDoWhyData'
import { NodeResponseStatus } from '~enums'
import { NodeRequest, ProjectFile } from '~interfaces'
import {
	checkEstimateStatus,
	executeNode,
	returnOrchestratorStatus,
	terminateRun,
	uploadFiles,
} from '~resources'
import { createFormData, isStatusProcessing, wait } from '~utils'

export class Run {
	private fileUrl = ''
	private fileName = ''
	private _orchestratorResponse
	private _onStart: ((...args) => void) | undefined
	private _onUpdate: ((...args) => void) | undefined
	private _onComplete: ((...args) => void) | undefined
	private _onCancel: ((...args) => void) | undefined

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

	async uploadFiles(projectFiles: ProjectFile[]): Promise<void> {
		const filesData = createFormData(projectFiles)
		const files = await uploadFiles(filesData)
		this.fileUrl = files.uploaded_files[projectFiles[0].name]
		this.fileName = projectFiles[0].name
	}

	private async getStatus() {
		let status = await returnOrchestratorStatus(
			this._orchestratorResponse.statusQueryGetUri,
		)

		let estimateStatus
		while (isStatusProcessing(status?.runtimeStatus as NodeResponseStatus)) {
			;[status, estimateStatus] = await Promise.all([
				returnOrchestratorStatus(this._orchestratorResponse.statusQueryGetUri),
				checkEstimateStatus(status?.instanceId as string),
				wait(3000),
			])

			this._onUpdate && this._onUpdate({ ...status, ...estimateStatus })
		}
		return { ...status, ...estimateStatus }
	}

	async execute(estimateNode: NodeRequest): Promise<void> {
		const loadNode = buildLoadNode(this.fileUrl, this.fileName)
		const nodes = {
			nodes: [...loadNode.nodes, ...estimateNode?.nodes],
		}
		if (!nodes) return
		this._orchestratorResponse = await executeNode(nodes)
		this._onStart && this._onStart(this.orchestratorResponse)
		const status = await this.getStatus()
		this._onComplete && this._onComplete(status)
	}

	cancel(): void {
		this.orchestratorResponse &&
			terminateRun(this._orchestratorResponse.terminatePostUri)
		this._onCancel && this._onCancel()
	}
}
