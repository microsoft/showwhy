/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface DimensionProps {
	dimensions?: {
		width: number
		height: number
	}
}

export enum GraphViewStates {
	CausalView,
	CorrelationView2D,
	CorrelationView3D,
}
