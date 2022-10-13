/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import Xarrow from 'react-xarrows'

import { map } from '../../utils/Math.js'
import type { CorrelationEdgeProps } from './CorrelationEdge.types.js'

export const CorrelationEdge: React.FC<CorrelationEdgeProps> = memo(
	function CorrelationEdge({ correlation, minEdgeWidth, maxEdgeWidth }) {
		return (
			<Xarrow
				start={correlation.source.columnName}
				end={correlation.target.columnName}
				startAnchor={{ position: 'middle', offset: { x: 0, y: 0 } }}
				endAnchor={{ position: 'middle', offset: { x: 0, y: 0 } }}
				color={`rgba(100, 100, 100, ${Math.abs(correlation.weight) + 0.2})`}
				strokeWidth={map(
					Math.abs(correlation.weight),
					0,
					1,
					minEdgeWidth,
					maxEdgeWidth,
				)}
				showHead={false}
				showTail={false}
				key={correlation.key + '-correlation'}
				labels={
					<div style={{ fontSize: '8pt' }}>
						ρ={correlation.weight.toFixed(2)}
					</div>
				}
				dashness={{ strokeLen: 10, nonStrokeLen: 10 }}
				path={'straight'}
			/>
		)
	},
)
