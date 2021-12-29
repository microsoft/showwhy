/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { buildLoadNode } from '../resources'
import { Orchestrator } from './orchestrator'
import { StatusType } from '~enums'
import { NodeRequest, ProjectFile, OrchestratorRun } from '~interfaces'
import { uploadFiles } from '~resources'
import { createFormData } from '~utils'

export class Estimate implements OrchestratorRun {
	private fileUrl = ''
	private fileName = ''
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

	async uploadFiles(projectFiles: ProjectFile[]): Promise<void> {
		const filesData = createFormData(projectFiles)
		const files = await uploadFiles(filesData)
		this.fileUrl = files.uploaded_files[projectFiles[0].name]
		this.fileName = projectFiles[0].name
	}

	async execute(estimateNode: NodeRequest): Promise<void> {
		const loadNode = buildLoadNode(this.fileUrl, this.fileName)
		const nodes = {
			nodes: [...loadNode.nodes, ...estimateNode?.nodes],
		}
		if (!nodes) return undefined
		await this.orchestrator.execute(nodes, StatusType.Estimate)
	}

	async cancel(): Promise<void> {
		await this.orchestrator.cancel()
	}
}
