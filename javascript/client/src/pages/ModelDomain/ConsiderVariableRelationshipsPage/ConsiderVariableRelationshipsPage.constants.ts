/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalFactorType } from '@showwhy/types'

export const tableHeader = [
	{ fieldName: 'variable', value: 'Label' },
	{ fieldName: CausalFactorType.CauseExposure, value: 'Causes Exposure' },
	{ fieldName: CausalFactorType.CauseOutcome, value: 'Causes Outcome' },
	{ fieldName: 'reasoning', value: 'Reasoning' },
]
