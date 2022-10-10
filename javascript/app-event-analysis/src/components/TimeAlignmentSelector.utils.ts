/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TimeAlignmentOptions } from '../types'
import type { TimeAlignmentKeyString as TimeAlignment } from '../types.js'

export function getTimeAlignmentLabel(key: TimeAlignment) {
	return TimeAlignmentOptions[key]
}
