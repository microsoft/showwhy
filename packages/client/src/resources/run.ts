/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus } from '~enums'
import { CheckStatus, NodeRequest, ProjectFile } from '~interfaces'
import {
	checkEstimateStatus,
	executeNode,
	returnOrchestratorStatus,
	terminateRun,
	uploadFiles,
} from '~resources'
import { createFormData, isStatusProcessing, wait } from '~utils'
import { buildLoadNode } from './prepareDoWhyData'

export class Run {
	private fileUrl = ''
	private fileName = ''
	public orchestratorResponse
	private _onUpdate: ((status: CheckStatus) => void) | undefined
	private _onComplete: ((status: CheckStatus) => void) | undefined
	private _onCancel: (() => void) | undefined

	constructor(
		onUpdate?: (status: CheckStatus) => void,
		onComplete?: (status: CheckStatus) => void,
		onCancel?: () => void,
	) {
		this._onUpdate = onUpdate
		this._onComplete = onComplete
		this._onCancel = onCancel
	}

	async uploadFiles(projectFiles: ProjectFile[]) {
		const filesData = createFormData(projectFiles)
		const files = await uploadFiles(filesData)
		this.fileUrl = files.uploaded_files[projectFiles[0].name]
		this.fileName = projectFiles[0].name
	}

	private async getStatus() {
		let status = await returnOrchestratorStatus(
			this.orchestratorResponse.statusQueryGetUri,
		)

		let estimateStatus
		while (isStatusProcessing(status?.runtimeStatus as NodeResponseStatus)) {
			;[status, estimateStatus] = await Promise.all([
				returnOrchestratorStatus(this.orchestratorResponse.statusQueryGetUri),
				checkEstimateStatus(status?.instanceId as string),
				wait(3000),
			])

			this._onUpdate && this._onUpdate({ ...status, ...estimateStatus })
		}
		return { ...status, ...estimateStatus }
	}

	async startExecution(estimateNode: NodeRequest) {
		const loadNode = buildLoadNode(this.fileUrl, this.fileName)
		const nodes = {
			nodes: [...loadNode.nodes, ...estimateNode?.nodes],
		}
		if (!nodes) return
		this.orchestratorResponse = await executeNode(nodes)
		const status = await this.getStatus()
		this._onComplete && this._onComplete(status)
	}

	async cancel() {
		this.orchestratorResponse &&
			(await terminateRun(this.orchestratorResponse.terminatePostUri))
		this._onCancel && this._onCancel()
	}
}
