/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import {
	useResetCausalFactors,
	useResetDefineQuestion,
	useResetEstimators,
	useResetHoverState,
	useResetOriginalTables,
	useResetPrimarySpecificationConfig,
	useResetProjectFiles,
	useResetRefutationType,
	useResetRunHistory,
	useResetSelectedFile,
	useResetSpecificationCurveConfig,
} from '~state'

export const useResetProject = (): (() => void) => {
	const resetCausalFactors = useResetCausalFactors()
	const resetRefutationTests = useResetRefutationType()
	const resetEstimators = useResetEstimators()
	const resetDefineQuestion = useResetDefineQuestion()
	const resetOriginalTables = useResetOriginalTables()
	const resetProjectFiles = useResetProjectFiles()
	const resetSelectedFile = useResetSelectedFile()
	const resetRunHistory = useResetRunHistory()
	const resetSpecificationCurveConfig = useResetSpecificationCurveConfig()
	const resetPrimarySpecificationConfig = useResetPrimarySpecificationConfig()
	const resetHoverState = useResetHoverState()

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
	])
}
