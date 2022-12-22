/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	HoverInfo,
	OutputData,
	PlaceboOutputData,
	ProcessedInputData,
	SynthControlData,
} from '../types.js'

export interface EffectResultProps {
	treatedUnit: string
	inputData: ProcessedInputData
	outputData: (OutputData | PlaceboOutputData)[]
	hoverInfo: HoverInfo
	synthControlData: SynthControlData
	checkableUnits: string[]
	onRemoveCheckedUnit: (unitToRemove: string) => void
}
