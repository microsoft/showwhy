/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { BeliefDegree } from '~enums'

export interface Cause {
	causes: boolean
	degree: BeliefDegree | null
	reasoning: string
}

export interface Causes {
	causeExposure?: Cause
	causedByExposure?: Cause
	causeOutcome?: Cause
	causedByOutcome?: Cause
}

export interface CausalFactor {
	id: string
	description?: string
	variable: string
	causes?: Causes
	column?: string
}
