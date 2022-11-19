/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Tooltip } from '../hooks/useTooltip.js'

export interface ChartTooltipProps {
	tooltip: Tooltip
	checkableUnits: string[]
	checkedUnits: Set<string>
	onRemoveCheckedUnit: (unitToRemove: string) => void
}
