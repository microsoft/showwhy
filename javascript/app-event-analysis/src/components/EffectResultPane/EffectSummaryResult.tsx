/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { useTreatedUnitsValueState } from '../../state/index.js'
import { Container, Strong } from '../../styles/index.js'
import type { OutputData } from '../../types.js'
import { TimeAlignmentOptions } from '../../types.js'
import { getKeyByValue } from '../../utils/misc.js'
import {
	useHeaderText,
	useMeanTreatmentEffect,
} from './EffectSummaryResult.hooks.js'
import type { EffectSummaryResultProps } from './EffectSummaryResult.types.js'

export const EffectSummaryResult: React.FC<EffectSummaryResultProps> = memo(
	function EffectSummaryResult({ inputData, outputData, timeAlignment }) {
		const treatedUnits = useTreatedUnitsValueState()

		const outputDataNonPlacebo = useMemo<OutputData[]>(
			() =>
				outputData.filter((output) =>
					treatedUnits.includes(output.treatedUnit),
				) as OutputData[],
			[outputData, treatedUnits],
		)

		const [firstOutput] = outputDataNonPlacebo
		const { consistent_time_window } = firstOutput

		const headerText = useHeaderText(timeAlignment, firstOutput)
		const meanTreatmentEffect = useMeanTreatmentEffect(
			inputData,
			timeAlignment,
			outputDataNonPlacebo,
		)

		if (!outputDataNonPlacebo) return null

		return (
			<Container>
				{consistent_time_window &&
					timeAlignment ===
						getKeyByValue(TimeAlignmentOptions.Fixed_No_Overlap) && (
						<Text
							className="infoText italic light bottom-gap"
							variant="medium"
							block
						>
							NOTE: Pre-treatment period for all units is before the
							first-treated unit and post-treatment is after the last-treated
							unit.
						</Text>
					)}
				{consistent_time_window &&
					timeAlignment ===
						getKeyByValue(TimeAlignmentOptions.Shift_And_Align_Units) && (
						<Text
							className="infoText italic light bottom-gap"
							variant="medium"
							block
						>
							NOTE: Units with different treatment times have been aligned at
							time step {consistent_time_window[0]} (&quot;T&quot;).
						</Text>
					)}
				<Text className="infoText bottom-gap" variant="medium">
					{headerText}
				</Text>
				{outputDataNonPlacebo.length > 1 && (
					<Text className="infoText" variant="medium" block>
						<Strong>
							Mean treatment effect across all treated units is{' '}
							{meanTreatmentEffect}
						</Strong>
					</Text>
				)}

				{outputDataNonPlacebo.map((output) => (
					<Text
						key={output.treatedUnit}
						className="infoText"
						variant="medium"
						block
					>
						{'Treatment effect in '}
						{output.treatedUnit}
						{': '}
						<Strong
							className={output.sdid_estimate < 0 ? 'negative' : 'positive'}
						>
							{output.sdid_estimate}
						</Strong>
					</Text>
				))}
			</Container>
		)
	},
)
