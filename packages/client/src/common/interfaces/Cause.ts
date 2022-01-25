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
