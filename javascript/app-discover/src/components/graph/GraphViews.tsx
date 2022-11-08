/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, Suspense } from 'react'
import { useRecoilState } from 'recoil'

import { GraphViewState } from '../../state/index.jsx'
import { PaddedSpinner } from '../CauseDis.styles.js'
import { CausalGraphExplorer } from './CausalGraphExplorer.jsx'
import { CorrelationGraph2D } from './CorrelationGraph2D.jsx'
import { CorrelationGraph3D } from './CorrelationGraph3D.js'
import type { DimensionProps } from './GraphViews.types.js'
import { GraphViewStates } from './GraphViews.types.js'

function isValidSize(n: number | undefined): boolean {
	return Boolean(n && n > 0 && n !== Infinity)
}

export const GraphViews: React.FC<DimensionProps> = memo(function GraphViews({
	dimensions,
}) {
	const [selectedViewKey] = useRecoilState(GraphViewState)
	const verticalMargin = 10
	const width = isValidSize(dimensions?.width) ? dimensions!.width : 800
	let height = isValidSize(dimensions?.height) ? dimensions!.height : 800
	if (height > verticalMargin) {
		height -= verticalMargin
	}

	let activeGraphView
	switch (selectedViewKey) {
		case GraphViewStates.CorrelationView2D:
			activeGraphView = <CorrelationGraph2D width={width} height={height} />
			break
		case GraphViewStates.CorrelationView3D:
			activeGraphView = <CorrelationGraph3D width={width} height={height} />
			break
		default:
			activeGraphView = (
				<Suspense fallback={<PaddedSpinner label="Recalculating..." />}>
					<div
						style={{
							width,
							height,
							position: 'relative',
							top: '10px',
						}}
					>
						<CausalGraphExplorer />
					</div>
				</Suspense>
			)
			break
	}

	return <>{activeGraphView}</>
})
