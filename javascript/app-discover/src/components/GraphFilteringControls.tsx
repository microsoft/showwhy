/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Toggle } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import {
	ConfidenceThresholdState,
	CorrelationThresholdState,
	FixedInterventionRangesEnabledState,
	SelectedCausalDiscoveryAlgorithmState,
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

	return (
		<GraphFilteringContainer>
			<ThresholdSlider
				label={'Correlation visibility threshold'}
				thresholdState={CorrelationThresholdState}
				defaultStyling
			/>
			{selectedCausalDiscoveryAlgorithm !== CausalDiscoveryAlgorithm.PC && (
				<ThresholdSlider
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
					<Toggle
						label="Fixed intervention ranges"
						checked={fixedInterventionRangesEnabled}
						onChange={(e, v) => setFixedInterventionRangesEnabled(Boolean(v))}
					/>
				</>
			)}
		</GraphFilteringContainer>
	)
})
