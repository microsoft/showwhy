/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { buildLoadNode } from '../resources'
import { NodeResponseStatus } from '~enums'
import { NodeRequest, ProjectFile } from '~interfaces'
import {
	checkEstimateStatus,
	executeNode,
	returnOrchestratorStatus,
	uploadFiles,
} from '~resources'
import { createFormData, isStatusProcessing, wait } from '~utils'
import { Orchestrator } from './orchestrator'

export class Estimate extends Orchestrator {
	constructor(
		onStart?: (...args) => void,
		onUpdate?: (...args) => void,
		onComplete?: (...args) => void,
		onCancel?: (...args) => void,
	) {
		super(onStart, onUpdate, onComplete, onCancel)
	}

	async uploadFiles(projectFiles: ProjectFile[]): Promise<void> {
		const filesData = createFormData(projectFiles)
		const files = await uploadFiles(filesData)
		this.fileUrl = files.uploaded_files[projectFiles[0].name]
		this.fileName = projectFiles[0].name
	}

	protected async getStatus() {
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
}
