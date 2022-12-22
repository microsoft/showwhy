/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack, Text } from '@fluentui/react'
import { memo, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { TreatedUnitsState } from '../state/state.js'
import type { OutputData } from '../types.js'
import { TimeAlignmentOptions } from '../types.js'
import { getKeyByValue } from '../utils/misc.js'
import {
	useHeaderText,
	useMeanTreatmentEffect,
} from './EffectSummaryResult.hooks.js'
import type { EffectSummaryResultProps } from './EffectSummaryResult.types.js'
import { Strong } from './style/Styles.js'

export const EffectSummaryResult: React.FC<EffectSummaryResultProps> = memo(
	function EffectSummaryResult({ inputData, outputData, timeAlignment }) {
		const treatedUnits = useRecoilValue(TreatedUnitsState)

		const outputDataNonPlacebo = useMemo<OutputData[]>(
			() =>
				outputData.filter(output =>
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
			<Stack>
				<Stack.Item>
					{consistent_time_window &&
						timeAlignment ===
							getKeyByValue(TimeAlignmentOptions.Fixed_No_Overlap) && (
							<Text
								className="infoText italic light bottom-gap"
								variant="medium"
							>
								NOTE: Pre-treatment period for all units is before the
								first-treated unit and post-treatment is after the last-treated
								unit.
								<br />
							</Text>
						)}
				</Stack.Item>
				<Stack.Item>
					{consistent_time_window &&
						timeAlignment ===
							getKeyByValue(TimeAlignmentOptions.Shift_And_Align_Units) && (
							<Text
								className="infoText italic light bottom-gap"
								variant="medium"
							>
								NOTE: Units with different treatment times have been aligned at
								time step {consistent_time_window[0]} (&quot;T&quot;).
								<br />
							</Text>
						)}
				</Stack.Item>
				<Stack.Item>
					<Text className="infoText bottom-gap" variant="medium">
						{headerText}
						<br />
					</Text>
				</Stack.Item>
				{outputDataNonPlacebo.length > 1 && (
					<Stack.Item>
						<Text className="infoText" variant="medium">
							<Strong>
								Mean treatment effect across all treated units is{' '}
								{meanTreatmentEffect}
							</Strong>
							<br />
						</Text>
					</Stack.Item>
				)}

				<Stack.Item className="summary-list">
					{outputDataNonPlacebo.map(output => (
						<Text
							key={output.treatedUnit}
							className="infoText"
							variant="medium"
						>
							{'Treatment effect in '}
							{output.treatedUnit}
							{': '}
							<Strong
								className={output.sdid_estimate < 0 ? 'negative' : 'positive'}
							>
								{output.sdid_estimate}
							</Strong>
							<br />
						</Text>
					))}
				</Stack.Item>
			</Stack>
		)
	},
)
