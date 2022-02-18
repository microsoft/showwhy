/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import { RefutationType } from '../refutation'
import { DataTableFileDefinition } from './DataTableDefinition'
import {
	CausalFactor,
	Definition,
	Experiment,
	Estimator,
	PrimarySpecificationConfig,
	TableColumn,
	DefaultDatasetResult,
} from '~types'

interface PostLoadTable {
	tableName: string
	steps: Step[]
}

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
	tableColumns?: TableColumn[]
	modelVariables?: Definition
	defaultResult?: DefaultDatasetResult
	// TODO: this should be integrated as a flag on each page's data
	todoPages?: string[]
	postLoad?: PostLoadTable[]
	confidenceInterval?: boolean
	tablesPrep?: Step[]
	subjectIdentifier?: string
}
