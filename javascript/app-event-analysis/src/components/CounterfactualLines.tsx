/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'

import { useLinesData } from './CounterfactualLines.hooks.js'
import type { CounterfactualLinesProps } from './CounterfactualLines.types.js'

export const CounterfactualLines: React.FC<CounterfactualLinesProps> = memo(
	function CounterfactualLines(props: CounterfactualLinesProps) {
		const linesData = useLinesData(props)

		if (!linesData.length) return null

		return (
			<g>
				{linesData.map((lineProps, index) => (
					<line key={`${lineProps.className}@${index}`} {...lineProps} />
				))}
			</g>
		)
	},
)
