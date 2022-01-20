/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import { RefutationTypes } from '~enums'
import {
	CausalFactor,
	Definition,
	DescribeElements,
	Estimator,
	PrimarySpecificationConfig,
	TableColumn,
	DefaultDatasetResult,
} from '~interfaces'

/**
 * This contains a collection of step data and file definitions for a saveable
 * project package.
 * TODO: eventually this should merge with our notion of a "project"
 */
export interface Workspace {
	name: string
	tables: DataTableDefinition[]
	primarySpecification?: PrimarySpecificationConfig
	causalFactors?: CausalFactor[]
	defineQuestion?: DescribeElements
	estimators?: Estimator[]
	refutations?: RefutationTypes
	tableColumns?: TableColumn[]
	modelVariables?: Definition
	defaultResult?: DefaultDatasetResult
	// TODO: this should be integrated as a flag on each page's data
	todoPages?: string[]
	postLoad?: {
		steps: Step[]
	}
	confidenceInterval?: boolean | undefined
}

export interface FileDefinition {
	name: string
	url: string
}

export interface Metadata {
	/**
	 * Paper citation for a dataset to document publication
	 */
	citation?: string
	/**
	 * URL for ownership host site that user can go to for dataset
	 */
	source?: string
	/**
	 * Link to data use license for the dataset
	 */
	license?: string
}

export interface DataTableDefinition extends FileDefinition {
	primary?: boolean | undefined
	metadata?: Metadata
	/**
	 * Optional explicit delimiter to parse data table with.
	 * Will default to trying to guess from the file extension.
	 * TODO: support non-delimited files such as JSON
	 */
	delimiter?: string
}
