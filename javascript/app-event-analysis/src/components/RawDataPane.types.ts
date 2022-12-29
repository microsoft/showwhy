/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	MessageBarProps,
	OutputData,
	PlaceboOutputData,
	ProcessedInputData,
} from '../types.js'

export interface RawDataPaneProps {
	inputData: ProcessedInputData
	outputData: (OutputData | PlaceboOutputData)[]
	statusMessage: MessageBarProps
	checkableUnits: string[]
	onRemoveCheckedUnit: (unitToRemove: string) => void
}
