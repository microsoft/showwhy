/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ElkNode } from 'elkjs'

export interface DraggableGraphNodeProps {
	children: React.ReactNode
	id: string
	layout?: ElkNode
	layoutTransitionTime?: number
}
