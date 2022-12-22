/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	MessageBarProps,
	OutputData,
	PlaceboOutputData,
	ProcessedInputData,
	SynthControlData,
} from '../../types.js'

export interface EffectResultPaneProps {
	inputData: ProcessedInputData
	outputData: (OutputData | PlaceboOutputData)[]
	synthControlData: SynthControlData
	statusMessage: MessageBarProps
	isCalculatingEstimator: boolean
	timeAlignment: string
	checkableUnits: string[]
	onRemoveCheckedUnit: (unitToRemove: string) => void
}
