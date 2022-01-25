/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { StepLink } from './StepLink'

export interface StepResource {
	id: string
	title: string
	links: StepLink[]
}
