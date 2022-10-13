/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CausalFactor } from '../causality/CausalFactor.js'
import type { Estimator } from '../estimators/Estimator.js'
import type { Definition } from '../experiments/Definition.js'
import type { PrimarySpecificationConfig } from '../experiments/PrimarySpecificationConfig.js'
import type { CausalQuestion } from '../question/CausalQuestion.js'
import type { DefaultDatasetResult } from './DefaultDatasetResult.js'

/**
 * This contains a collection of step data and file definitions for a saveable
 * project package.
 * TODO: eventually this should merge with our notion of a "project"
 */
export interface ProjectJson {
	name: string
	primarySpecification?: PrimarySpecificationConfig
	causalFactors?: CausalFactor[]
	definitions?: Definition[]
	question?: CausalQuestion
	estimators?: Estimator[]
	defaultResult?: DefaultDatasetResult
	subjectIdentifier?: string
	selectedTableName: string
}
