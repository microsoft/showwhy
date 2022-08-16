/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowObject } from '@data-wrangling-components/core'
import type {
	CausalFactor,
	Definition,
	Estimator,
	PrimarySpecificationConfig,
	Question,
} from '@showwhy/types'

import type { DataTableFileDefinition } from './DataTableDefinition.js'
import type { DefaultDatasetResult } from './DefaultDatasetResult.js'

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
	definitions?: Definition[]
	question?: Question
	estimators?: Estimator[]
	refutations?: number
	defaultResult?: DefaultDatasetResult
	// TODO: this should be integrated as a flag on each page's data
	todoPages?: string[]
	confidenceInterval?: boolean
	subjectIdentifier?: string
	postLoad?: WorkflowObject[]
	tablesPrep?: WorkflowObject[]
}
