/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { StepStatus } from '~enums'

export interface StepList {
	id: string
	name: string
	steps: Step[]
	subSteps?: StepList[]
}

interface StepLink {
	title: string
	description: string
	image: string
	url: string
}

interface StepResource {
	id: string
	title: string
	links: StepLink[]
}

export interface Step {
	id: string
	title: string
	guidance: string
	status: StepStatus
	url: string
	showStatus?: boolean
	resources?: StepResource[]
	subStepName?: string
}

export interface Panel {
	id: string
	name: string
	steps: Step[]
}
