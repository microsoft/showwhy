/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface FlatCausalFactor {
	id: string
	description: string
	variable?: string
	causeExposure: number
	causeOutcome: number
	reasoning: string
	type: string
}
