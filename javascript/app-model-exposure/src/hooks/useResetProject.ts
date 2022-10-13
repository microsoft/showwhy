/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

import { useResetCausalFactors } from '../state/causalFactors.js'
import { useResetCausalQuestion } from '../state/causalQuestion.js'
import { useResetConfidenceIntervalResponse } from '../state/confidenceIntervalResponse.js'
import { useResetDefaultDatasetResult } from '../state/defaultDatasetResult.js'
import { useResetDefinitions } from '../state/definitions.js'
import { useResetEstimateEffectResponse } from '../state/estimateEffectResponse.js'
import { useResetEstimators } from '../state/estimators.js'
import { useResetPrimarySpecificationConfig } from '../state/primarySpecificationConfig.js'
import { useResetRefutationResponse } from '../state/refutationResponse.js'
import { useResetRunHistory } from '../state/runHistory.js'
import { useResetSelectedTableName } from '../state/selectedDataPackage.js'
import { useResetShapResponse } from '../state/shapResponse.js'
import { useResetSignificanceTest } from '../state/significanceTests.js'
import { useResetSpecCount } from '../state/specCount.js'
import {
	useResetHoverState,
	useResetSpecificationCurveConfig,
} from '../state/specificationCurveConfig.js'
import { useResetSubjectIdentifier } from '../state/subjectIdentifier.js'
import type { Handler } from '../types/primitives.js'

export function useResetProject(): Handler {
	const resetCausalFactors = useResetCausalFactors()
	const resetEstimators = useResetEstimators()
	const resetQuestion = useResetCausalQuestion()
	const resetSelectedDataPackage = useResetSelectedTableName()
	const resetRunHistory = useResetRunHistory()
	const resetSpecificationCurveConfig = useResetSpecificationCurveConfig()
	const resetPrimarySpecificationConfig = useResetPrimarySpecificationConfig()
	const resetHoverState = useResetHoverState()
	const resetSubjectIdentifier = useResetSubjectIdentifier()
	const resetDefaultDatasetResult = useResetDefaultDatasetResult()
	const resetSpecCount = useResetSpecCount()
	const resetSignificanteTest = useResetSignificanceTest()
	const resetDefinitions = useResetDefinitions()
	const resetConfidenceIntervalResponse = useResetConfidenceIntervalResponse()
	const resetEstimateEffectResponse = useResetEstimateEffectResponse()
	const resetRefutationResponse = useResetRefutationResponse()
	const resetShapResponse = useResetShapResponse()

	return useCallback(() => {
		resetCausalFactors()
		resetEstimators()
		resetQuestion()
		resetHoverState()
		resetRunHistory()
		resetSpecificationCurveConfig()
		resetPrimarySpecificationConfig()
		resetSubjectIdentifier()
		resetSelectedDataPackage()
		resetDefaultDatasetResult()
		resetSpecCount()
		resetSignificanteTest()
		resetDefinitions()
		resetConfidenceIntervalResponse()
		resetEstimateEffectResponse()
		resetRefutationResponse()
		resetShapResponse()
	}, [
		resetCausalFactors,
		resetEstimators,
		resetQuestion,
		resetHoverState,
		resetRunHistory,
		resetSpecificationCurveConfig,
		resetPrimarySpecificationConfig,
		resetSubjectIdentifier,
		resetSelectedDataPackage,
		resetDefaultDatasetResult,
		resetSpecCount,
		resetSignificanteTest,
		resetDefinitions,
		resetConfidenceIntervalResponse,
		resetEstimateEffectResponse,
		resetRefutationResponse,
		resetShapResponse,
	])
}
