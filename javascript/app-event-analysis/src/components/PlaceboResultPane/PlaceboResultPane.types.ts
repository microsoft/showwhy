/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	MessageBarProps,
	OutputData,
	PlaceboDataGroup,
	PlaceboOutputData,
	ProcessedInputData,
} from '../../types.js'

export interface PlaceboResultPaneProps {
	inputData: ProcessedInputData
	statusMessage: MessageBarProps
	isCalculatingEstimator: boolean
	placeboDataGroup: Map<string, PlaceboDataGroup[]>
	placeboOutputData: Map<string, (OutputData | PlaceboOutputData)[]>
	checkableUnits: string[]
	onRemoveCheckedUnit: (unitToRemove: string) => void
}
