/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

import type { BarData, SynthControlData } from '../../types.js'

export function useSynthControlBarChartData(
	synthControlData: SynthControlData,
) {
	const theme = useThematic()

	return useMemo(() => {
		const barChartData = Object.keys(synthControlData).reduce(
			(acc, treatedUnitKey) => {
				acc[treatedUnitKey] = synthControlData[treatedUnitKey]
					.map((weightedUnit) => ({
						name: weightedUnit.unit,
						value: weightedUnit.weight,
						color: theme.process().fill().hex(),
					}))
					.reverse()
				return acc
			},
			{} as { [treatedUnitKey: string]: BarData[] },
		)
		return barChartData
	}, [theme, synthControlData])
}
