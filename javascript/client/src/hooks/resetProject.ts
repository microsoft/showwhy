/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { useCallback } from 'react'
import {
	useResetCausalFactors,
	useResetExperiment,
	useResetEstimators,
	useResetHoverState,
	useResetOriginalTables,
	useResetOutputTablePrep,
	useResetPrimarySpecificationConfig,
	useResetProjectFiles,
	useResetRefutationType,
	useResetRunHistory,
	useResetSelectedFile,
	useResetSpecificationCurveConfig,
	useResetSubjectIdentifier,
	useResetTablesPrepSpecification,
	useResetConfigJson,
	useResetConfidenceInterval,
	useResetDefaultDatasetResult,
	useResetFileCollection,
	useResetNodeResponse,
	useResetSelectedProject,
	useResetSpecCount,
} from '~state'

export function useResetProject(): Handler {
	const resetCausalFactors = useResetCausalFactors()
	const resetRefutationTests = useResetRefutationType()
	const resetEstimators = useResetEstimators()
	const resetDefineQuestion = useResetExperiment()
	const resetOriginalTables = useResetOriginalTables()
	const resetProjectFiles = useResetProjectFiles()
	const resetSelectedFile = useResetSelectedFile()
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
	const resetNodeResponse = useResetNodeResponse()
	const resetSelectedProject = useResetSelectedProject()
	const resetSpecCount = useResetSpecCount()

	return useCallback(() => {
		resetProjectFiles()
		resetSelectedFile()
		resetOriginalTables()
		resetCausalFactors()
		resetRefutationTests()
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
		resetNodeResponse()
		resetSelectedProject()
		resetSpecCount()
	}, [
		resetProjectFiles,
		resetSelectedFile,
		resetOriginalTables,
		resetCausalFactors,
		resetRefutationTests,
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
		resetNodeResponse,
		resetSelectedProject,
		resetSpecCount,
	])
}
