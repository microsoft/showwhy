/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Significance } from '../enums/Significance'

export interface TestResults {
	p_value: string
	significance: Significance
}
