/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	OutputData,
	PlaceboOutputData,
	ProcessedInputData,
} from '../types.js'

export interface RawDataPaneProps {
	inputData: ProcessedInputData
	outputData: (OutputData | PlaceboOutputData)[]
	checkableUnits: string[]
	onRemoveCheckedUnit: (unitToRemove: string) => void
}
