/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { useCallback } from 'react'

import {
	useResetCausalFactors,
	useResetConfidenceInterval,
	useResetConfigJson,
	useResetDefaultDatasetResult,
	useResetDefinitions,
	useResetDefinitionType,
	useResetEstimators,
	useResetFileCollection,
	useResetHoverState,
	useResetOutputTables,
	useResetPrimarySpecificationConfig,
	useResetProjectFiles,
	useResetQuestion,
	useResetRefutationCount,
	useResetRunHistory,
	useResetSelectedProject,
	useResetSignificanceTest,
	useResetSpecCount,
	useResetSpecificationCurveConfig,
	useResetSubjectIdentifier,
	useResetTablesPrepSpecification,
	useResetWorkflow,
} from '~state'

export function useResetProject(): Handler {
	const resetCausalFactors = useResetCausalFactors()
	const resetRefutationCount = useResetRefutationCount()
	const resetEstimators = useResetEstimators()
	const resetQuestion = useResetQuestion()
	const resetProjectFiles = useResetProjectFiles()
	const resetRunHistory = useResetRunHistory()
	const resetSpecificationCurveConfig = useResetSpecificationCurveConfig()
	const resetPrimarySpecificationConfig = useResetPrimarySpecificationConfig()
	const resetHoverState = useResetHoverState()
	const resetSubjectIdentifier = useResetSubjectIdentifier()
	const resetOutputTables = useResetOutputTables()
	const resetTablePrepSpecification = useResetTablesPrepSpecification()
	const resetConfigJson = useResetConfigJson()
	const resetConfidenceInterval = useResetConfidenceInterval()
	const resetDefaultDatasetResult = useResetDefaultDatasetResult()
	const resetFileCollection = useResetFileCollection()
	const resetSelectedProject = useResetSelectedProject()
	const resetSpecCount = useResetSpecCount()
	const resetSignificanteTest = useResetSignificanceTest()
	const resetDefinitions = useResetDefinitions()
	const resetDefinitionType = useResetDefinitionType()
	const resetWorkflow = useResetWorkflow()

	return useCallback(() => {
		resetProjectFiles()
		resetCausalFactors()
		resetRefutationCount()
		resetEstimators()
		resetQuestion()
		resetHoverState()
		resetRunHistory()
		resetSpecificationCurveConfig()
		resetPrimarySpecificationConfig()
		resetSubjectIdentifier()
		resetOutputTables()
		resetTablePrepSpecification()
		resetConfigJson()
		resetConfidenceInterval()
		resetDefaultDatasetResult()
		resetFileCollection()
		resetSelectedProject()
		resetSpecCount()
		resetSignificanteTest()
		resetDefinitions()
		resetDefinitionType()
		resetWorkflow()
	}, [
		resetProjectFiles,
		resetCausalFactors,
		resetRefutationCount,
		resetEstimators,
		resetQuestion,
		resetHoverState,
		resetRunHistory,
		resetSpecificationCurveConfig,
		resetPrimarySpecificationConfig,
		resetSubjectIdentifier,
		resetOutputTables,
		resetTablePrepSpecification,
		resetConfigJson,
		resetConfidenceInterval,
		resetDefaultDatasetResult,
		resetFileCollection,
		resetSelectedProject,
		resetSpecCount,
		resetSignificanteTest,
		resetDefinitions,
		resetDefinitionType,
		resetWorkflow,
	])
}
