/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Cause } from './Cause'

export interface Causes {
	causeExposure?: Cause
	causedByExposure?: Cause
	causeOutcome?: Cause
	causedByOutcome?: Cause
}
