/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface CausalDiscoveryResultEdge {
	data: {
		source: string
		target: string
		weight?: number
		origin?: string
		confidence?: number
	}
}
