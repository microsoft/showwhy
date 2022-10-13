/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NodeObject } from 'react-force-graph-3d'

import type { Relationship } from '../../domain/Relationship.jsx'

export interface NetworkGraphProps {
	correlations: Relationship[]
	width?: number
	height?: number
	is3D?: boolean
}

export interface NetworkGraphNode extends NodeObject {
	id: string
	name: string
}

export interface NetworkGraphLink {
	source: string
	target: string
	value: number
}
