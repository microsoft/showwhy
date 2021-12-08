/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { EstimatorsGroups, EstimatorsType } from '../enums'

export interface Estimator {
	group: EstimatorsGroups
	type: EstimatorsType
}
