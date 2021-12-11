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
	useResetModelVariables,
	useResetOriginalTables,
	useResetPrimarySpecificationConfig,
	useResetProjectFiles,
	useResetRefutationType,
	useResetRunHistory,
	useResetSelectedFile,
	useResetSpecificationCurveConfig,
	useResetTableColumns,
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
	const resetTableColumns = useResetTableColumns()
	const resetModelVariables = useResetModelVariables()
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
		resetTableColumns()
		resetModelVariables()
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
		resetTableColumns,
		resetModelVariables,
		resetSpecificationCurveConfig,
		resetPrimarySpecificationConfig,
	])
}
