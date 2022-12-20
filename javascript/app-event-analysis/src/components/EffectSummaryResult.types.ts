/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	OutputData,
	PlaceboOutputData,
	ProcessedInputData,
} from '../types.js'

export interface EffectSummaryResultProps {
	inputData: ProcessedInputData
	outputData: (OutputData | PlaceboOutputData)[]
	timeAlignment: string
}
