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
	useResetEstimators,
	useResetExperiment,
	useResetFileCollection,
	useResetHoverState,
	useResetOutputTablePrep,
	useResetPrimarySpecificationConfig,
	useResetProjectFiles,
	useResetRefutationCount,
	useResetRunHistory,
	useResetSelectedProject,
	useResetSignificanceTest,
	useResetSpecCount,
	useResetSpecificationCurveConfig,
	useResetSubjectIdentifier,
	useResetTablesPrepSpecification,
} from '~state'

export function useResetProject(): Handler {
	const resetCausalFactors = useResetCausalFactors()
	const resetRefutationCount = useResetRefutationCount()
	const resetEstimators = useResetEstimators()
	const resetDefineQuestion = useResetExperiment()
	const resetProjectFiles = useResetProjectFiles()
	const resetRunHistory = useResetRunHistory()
	const resetSpecificationCurveConfig = useResetSpecificationCurveConfig()
	const resetPrimarySpecificationConfig = useResetPrimarySpecificationConfig()
	const resetHoverState = useResetHoverState()
	const resetSubjectIdentifier = useResetSubjectIdentifier()
	const resetOutputTablePrep = useResetOutputTablePrep()
	const resetTablePrepSpecification = useResetTablesPrepSpecification()
	const resetConfigJson = useResetConfigJson()
	const resetConfidenceInterval = useResetConfidenceInterval()
	const resetDefaultDatasetResult = useResetDefaultDatasetResult()
	const resetFileCollection = useResetFileCollection()
	const resetSelectedProject = useResetSelectedProject()
	const resetSpecCount = useResetSpecCount()
	const resetSignificanteTest = useResetSignificanceTest()
	const resetDefinitions = useResetDefinitions()

	return useCallback(() => {
		resetProjectFiles()
		resetCausalFactors()
		resetRefutationCount()
		resetEstimators()
		resetDefineQuestion()
		resetHoverState()
		resetRunHistory()
		resetSpecificationCurveConfig()
		resetPrimarySpecificationConfig()
		resetSubjectIdentifier()
		resetOutputTablePrep()
		resetTablePrepSpecification()
		resetConfigJson()
		resetConfidenceInterval()
		resetDefaultDatasetResult()
		resetFileCollection()
		resetSelectedProject()
		resetSpecCount()
		resetSignificanteTest()
		resetDefinitions()
	}, [
		resetProjectFiles,
		resetCausalFactors,
		resetRefutationCount,
		resetEstimators,
		resetDefineQuestion,
		resetHoverState,
		resetRunHistory,
		resetSpecificationCurveConfig,
		resetPrimarySpecificationConfig,
		resetSubjectIdentifier,
		resetOutputTablePrep,
		resetTablePrepSpecification,
		resetConfigJson,
		resetConfidenceInterval,
		resetDefaultDatasetResult,
		resetFileCollection,
		resetSelectedProject,
		resetSpecCount,
		resetSignificanteTest,
		resetDefinitions,
	])
}
