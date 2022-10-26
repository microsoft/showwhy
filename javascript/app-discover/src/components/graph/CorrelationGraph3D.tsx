/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, Suspense } from 'react'
import { useRecoilValue } from 'recoil'

import { FilteredCorrelationsState } from '../../state/index.js'
import { PaddedSpinner } from '../CauseDis.styles.js'
import type { CorrelationGraph3DProps } from './CorrelationGraph3D.types.js'
import { NetworkGraphExplorer } from './NetworkGraphExplorer.js'

export const CorrelationGraph3D: React.FC<CorrelationGraph3DProps> = memo(
	function CorrelationGraph3DProps({ width, height }) {
		const correlations = useRecoilValue(FilteredCorrelationsState)
		return (
			<Suspense fallback={<PaddedSpinner label="Loading correlations..." />}>
				<NetworkGraphExplorer
					correlations={correlations}
					width={width}
					height={height}
				/>
			</Suspense>
		)
	},
)
