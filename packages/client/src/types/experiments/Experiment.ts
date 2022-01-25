/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Element } from './Element'
import { Hypothesis } from './Hypothesis'

export interface Experiment {
	population: Element
	exposure: Element
	outcome: Element
	hypothesis: Hypothesis
}
