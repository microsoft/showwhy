/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'

import { useLinesData } from './CounterfactualLines.hooks.js'
import type { CounterfactualLinesProps } from './CounterfactualLines.types.js'

export const CounterfactualLines: React.FC<CounterfactualLinesProps> = memo(
	function CounterfactualLines(props: CounterfactualLinesProps) {
		const linesData = useLinesData(props)

		const lines = useMemo(() => {
			if (linesData.length) {
				const counterfactualLines = linesData.map((lineProps, index) => (
					<line key={index} {...lineProps} />
				))
				return <g>{counterfactualLines}</g>
			}
			return null
		}, [linesData])

		return lines
	},
)
