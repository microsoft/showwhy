/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ChartOptions } from '../types'

export interface ChartOptionsGroupProps {
	options: ChartOptions
	onChange: (opt: ChartOptions) => void
	isPlaceboSimulation: boolean
}
