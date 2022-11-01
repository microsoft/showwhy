/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox } from '@fluentui/react'
import { memo, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import {
	ConfidenceThresholdState,
	CorrelationThresholdState,
	FixedInterventionRangesEnabledState,
	SelectedCausalDiscoveryAlgorithmState,
	useCausalGraph,
	WeightThresholdState,
} from '../state/index.js'
import { ThresholdSlider } from './controls/ThresholdSlider.js'
import { GraphFilteringContainer } from './GraphFilteringControls.styles.js'

export const GraphFilteringControls = memo(function GraphFilteringControls() {
	const selectedCausalDiscoveryAlgorithm = useRecoilValue(
		SelectedCausalDiscoveryAlgorithmState,
	)
	const [fixedInterventionRangesEnabled, setFixedInterventionRangesEnabled] =
		useRecoilState(FixedInterventionRangesEnabledState)
	const causalGraph = useCausalGraph()
	const maxWeight = useMemo((): any => {
		return causalGraph.relationships
			.reduce((max, p) => ((p?.weight || 0) > max ? +(p.weight ?? 0) : max), 1)
			.toFixed(2)
	}, [causalGraph])

	return (
		<GraphFilteringContainer>
			<ThresholdSlider
				label={'Correlation visibility threshold'}
				thresholdState={CorrelationThresholdState}
				defaultStyling
			/>
			{selectedCausalDiscoveryAlgorithm !== CausalDiscoveryAlgorithm.PC && (
				<ThresholdSlider
					max={maxWeight}
					label={'Edge weight threshold'}
					thresholdState={WeightThresholdState}
					defaultStyling
				/>
			)}
			{selectedCausalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.DECI && (
				<>
					<ThresholdSlider
						label={'Edge confidence threshold'}
						thresholdState={ConfidenceThresholdState}
						defaultStyling
					/>
					<Checkbox
						label="Fixed intervention ranges"
						checked={fixedInterventionRangesEnabled}
						onChange={(_, v) => setFixedInterventionRangesEnabled(Boolean(v))}
					/>
				</>
			)}
		</GraphFilteringContainer>
	)
})
