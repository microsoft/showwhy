/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	OutputData,
	PlaceboOutputData,
	ResultPaneProps,
} from '../types.js'

export interface DimensionedLineChartProps
	extends Pick<
		ResultPaneProps,
		'inputData' | 'checkableUnits' | 'onRemoveCheckedUnit'
	> {
	lineChartRef: React.MutableRefObject<HTMLDivElement | null>
	output: (OutputData | PlaceboOutputData)[]
	treatedUnitsList?: string[]
	isPlaceboSimulation?: boolean
	checkedUnits: Set<string> | null
}
