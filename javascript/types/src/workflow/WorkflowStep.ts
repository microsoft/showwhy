/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StepStatus } from './StepStatus.js'

export type GetMarkdownFn = () => Promise<{ default: string }>
export interface WorkflowStep {
	id: string
	title: string
	guidance?: string
	getMarkdown?: GetMarkdownFn
	status: StepStatus
	url: string
	subStepName?: string
}
