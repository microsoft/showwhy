/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	HoverInfo,
	OutputData,
	PlaceboDataGroup,
	PlaceboOutputData,
	ProcessedInputData,
} from '../types.js'

export interface PlaceboResultProps {
	treatedUnit: string
	hoverInfo: HoverInfo
	inputData: ProcessedInputData
	placeboDataGroup: Map<string, PlaceboDataGroup[]>
	placeboOutputData: Map<string, (OutputData | PlaceboOutputData)[]>
	checkableUnits: string[]
	onRemoveCheckedUnit: (unitToRemove: string) => void
}
