/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface FlatCausalFactor {
	id: string
	description: string
	causes: boolean
	degree: number
	reasoning: string
	variable?: string
}
