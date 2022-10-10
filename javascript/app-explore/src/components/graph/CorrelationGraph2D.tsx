/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { memo, Suspense } from 'react'
import { useRecoilValue } from 'recoil'

import { FilteredCorrelationsState } from '../../state/CorrelationsState.jsx'
import type { CorrelationGraph2DProps } from './CorrelationGraph2D.types.js'
import { NetworkGraphExplorer } from './NetworkGraphExplorer.jsx'

export const CorrelationGraph2D: React.FC<CorrelationGraph2DProps> = memo(
	function CorrelationGraph2D({ width, height }) {
		const correlations = useRecoilValue(FilteredCorrelationsState)
		return (
			<Suspense fallback={<Spinner label="Loading correlations..." />}>
				<NetworkGraphExplorer
					correlations={correlations}
					width={width}
					height={height}
					is3D={false}
				/>
			</Suspense>
		)
	},
)
