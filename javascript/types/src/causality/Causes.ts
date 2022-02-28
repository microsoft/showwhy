/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Cause } from './Cause'

export interface ExposureAndOutcomeCauses {
	causeExposure?: Cause
	causedByExposure?: Cause
	causeOutcome?: Cause
	causedByOutcome?: Cause
}
