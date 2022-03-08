/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Specification } from '@data-wrangling-components/core'
import type {
	CausalFactor,
	Estimator,
	Experiment,
	PrimarySpecificationConfig,
	RefutationType,
} from '@showwhy/types'

import type { DefaultDatasetResult } from '~types'

import type { DataTableFileDefinition } from './DataTableDefinition'

/**
 * This contains a collection of step data and file definitions for a saveable
 * project package.
 * TODO: eventually this should merge with our notion of a "project"
 */
export interface Workspace {
	name: string
	tables: DataTableFileDefinition[]
	primarySpecification?: PrimarySpecificationConfig
	causalFactors?: CausalFactor[]
	defineQuestion?: Experiment
	estimators?: Estimator[]
	refutations?: RefutationType
	defaultResult?: DefaultDatasetResult
	// TODO: this should be integrated as a flag on each page's data
	todoPages?: string[]
	confidenceInterval?: boolean
	subjectIdentifier?: string
	postLoad?: Specification[]
	tablesPrep?: Specification[]
}
