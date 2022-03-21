/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ProcessHelpLink } from './ProcessHelpLink'

export interface ProcessHelpResource {
	id: string
	title: string
	links: ProcessHelpLink[]
}
