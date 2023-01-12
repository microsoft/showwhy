/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'
import type { CausalFactor } from '../types/causality/CausalFactor.js'
import type { Estimator } from '../types/estimators/Estimator.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { PrimarySpecificationConfig } from '../types/experiments/PrimarySpecificationConfig.js'
import type { CausalQuestion } from '../types/question/CausalQuestion.js'
import type { DefaultDatasetResult } from '../types/workspace/DefaultDatasetResult.js'
import { EXPOSURE_PROFILE } from './constants.js'

export interface ExposureResourceSchema extends ResourceSchema {
	profile: typeof EXPOSURE_PROFILE
	projectName: string
	causalFactors: CausalFactor[]
	defaultResult: DefaultDatasetResult
	estimators: Estimator[]
	primarySpecification: PrimarySpecificationConfig
	definitions: Definition[]
	question: CausalQuestion
	selectedTableName: string
}
