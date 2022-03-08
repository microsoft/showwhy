/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { BeliefDegree } from './BeliefDegree.js'

export interface Cause {
	causes: boolean
	degree: BeliefDegree | null
	reasoning: string
}
