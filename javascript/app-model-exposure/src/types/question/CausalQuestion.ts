/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Hypothesis } from '@showwhy/app-common'

import type { CausalQuestionElement } from './CausalQuestionElement.js'

export interface CausalQuestion {
	population: CausalQuestionElement
	exposure: CausalQuestionElement
	outcome: CausalQuestionElement
	hypothesis: Hypothesis
}
