/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'

import { Axis } from './Axis.js'
import { AxisType } from './Axis.types.js'
import type { LineChartAxisProps } from './LineChartAxis.types.js'

export const LineChartAxis: React.FC<LineChartAxisProps> = memo(
	function LineChartAxis({ height, xScale, yScale, tickFormatAsWholeNumber }) {
		return (
			<>
				<Axis type={AxisType.Left} myscale={yScale} ticks={5} />
				<Axis
					type={AxisType.Bottom}
					myscale={xScale}
					tickFormatAsWholeNumber={tickFormatAsWholeNumber}
					transform={`translate(0, ${height})`}
				/>
			</>
		)
	},
)
