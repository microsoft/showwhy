/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Hypothesis } from '../enums'
import { Element } from './Element'

export interface DescribeElements {
	population: Element
	exposure: Element
	outcome: Element
	hypothesis: Hypothesis
}
