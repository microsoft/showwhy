/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Element } from './Element.js'
import type { ElementDefinition } from './ElementDefinition.js'
import type { Hypothesis } from './Hypothesis.js'

export interface Experiment {
	definitions?: ElementDefinition[]
	population: Element
	exposure: Element
	outcome: Element
	hypothesis: Hypothesis
}
