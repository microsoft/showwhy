/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface WorkflowHelpLink {
	title: string
	description: string
	image: string
	url: string
}

interface WorkflowHelpResource {
	id: string
	title: string
	links: WorkflowHelpLink[]
}

export interface WorkflowHelp {
	id: string
	title: string
	resources: WorkflowHelpResource[]
	getMarkdown: () => Promise<{ default: string }>
}
