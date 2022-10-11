/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Toggle } from '@fluentui/react'
import { memo } from 'react'
import {
	useAutoLayoutEnabled,
	useCorrelationThreshold,
	useSetAutoLayoutEnabled,
	useSetCorrelationThreshold,
	useSetStraightEdges,
	useSetWeightThreshold,
	useStraightEdges,
	useWeightThreshold,
} from '../state/UIState.js'
import { ThresholdSlider } from './controls/ThresholdSlider.js'

export const ViewControls: React.FC = memo(function ViewControls() {
	const straightEdges = useStraightEdges()
	const setUseStraightEdges = useSetStraightEdges()
	const autoLayoutEnabled = useAutoLayoutEnabled()
	const setAutoLayoutEnabled = useSetAutoLayoutEnabled()
	const correlationThreshold = useCorrelationThreshold()
	const setCorrelationThreshold = useSetCorrelationThreshold()
	const weightThreshold = useWeightThreshold()
	const setWeightThreshold = useSetWeightThreshold()
	return (
		<>
			<Toggle
				label="Use straight edges"
				checked={straightEdges}
				onChange={(_e, v) => setUseStraightEdges(Boolean(v))}
			/>
			<Toggle
				label="Auto-layout"
				checked={autoLayoutEnabled}
				onChange={(_e, v) => setAutoLayoutEnabled(Boolean(v))}
			/>
			<ThresholdSlider
				label={'Correlation Threshold'}
				width={200}
				value={correlationThreshold}
				setValue={setCorrelationThreshold}
			/>
			<ThresholdSlider
				label={'Edge Weight Threshold'}
				width={200}
				value={weightThreshold}
				setValue={setWeightThreshold}
			/>
		</>
	)
})
