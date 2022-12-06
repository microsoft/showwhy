/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'

import type { GridProps } from './Grid.types.js'
import { GridLine } from './GridLine.js'
import { GridLineType } from './GridLine.types.js'

export const Grid: React.FC<GridProps> = memo(function Grid({
	height,
	width,
	xScale,
	yScale,
	ticks = 10,
}) {
	const transform = useMemo<string>(() => `translate(0, ${height})`, [height])

	return (
		<>
			<GridLine
				type={GridLineType.Vertical}
				myscale={yScale}
				tickSize={width}
				ticks={ticks}
			/>
			<GridLine
				myscale={xScale}
				tickSize={height}
				ticks={10}
				transform={transform}
			/>
		</>
	)
})
