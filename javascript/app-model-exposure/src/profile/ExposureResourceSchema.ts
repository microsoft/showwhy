/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'

import type { ConfidenceIntervalStatus } from '../types/api/ConfidenceIntervalStatus.js'
import type { EstimateEffectStatus } from '../types/api/EstimateEffectStatus.js'
import type { RefutationStatus } from '../types/api/RefutationStatus.js'
import type { ShapStatus } from '../types/api/ShapStatus.js'
import type { SignificanceTestStatus } from '../types/api/SignificanceTestStatus.js'
import type { SpecificationCount } from '../types/api/SpecificationCount.js'
import type { CausalFactor } from '../types/causality/CausalFactor.js'
import type { Estimator } from '../types/estimators/Estimator.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { PrimarySpecificationConfig } from '../types/experiments/PrimarySpecificationConfig.js'
import type { Maybe } from '../types/primitives.js'
import type { CausalQuestion } from '../types/question/CausalQuestion.js'
import type { RunHistory } from '../types/runs/RunHistory.js'
import type { SpecificationCurveConfig } from '../types/visualization/SpecificationCurveConfig.js'
import type { DefaultDatasetResult } from '../types/workspace/DefaultDatasetResult.js'
import type { PageTabs } from '../types/workspace/PageTabs.js'
import type { EXPOSURE_PROFILE } from './constants.js'

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
	pageTabState: PageTabs
	confidenceIntervalResponse: ConfidenceIntervalStatus[]
	confounderThreshold: number
	estimateEffectResponse: EstimateEffectStatus[]
	refutationResponse: RefutationStatus[]
	runHistory: RunHistory[]
	shapResponse: ShapStatus[]
	significanceTest: SignificanceTestStatus[]
	specCount: Maybe<SpecificationCount>
	specificationCurveConfig: SpecificationCurveConfig
	subjectIdentifier: Maybe<string>
}
