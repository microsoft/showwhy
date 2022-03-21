/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ProcessHelpResource } from './ProcessHelpResource'

export interface ProcessHelp {
	id: string
	title: string
	resources: ProcessHelpResource[]
	getMarkdown: () => Promise<{ default: string }>
}
