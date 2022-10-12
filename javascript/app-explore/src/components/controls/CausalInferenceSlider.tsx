/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Slider, Stack, Text } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
	CausalInferenceDifferenceFromBaselineValuesState,
	CausalInferenceResultState,
	CausalInterventionsState,
} from '../../state/index.jsx'
import {
	icon_button_props,
	icon_button_style,
	negative_change_text_style,
	positive_change_text_style,
	slider_stack_tokens,
	slider_style,
} from './CausalInferenceSlider.constants.js'
import type { CausalInferenceSliderProps } from './CausalInferenceSlider.types.js'

export const CausalInferenceSlider: React.FC<CausalInferenceSliderProps> = memo(
	function CausalInferenceSlider({ variable, wasDragged }) {
		const differenceValues = useRecoilValue(
			CausalInferenceDifferenceFromBaselineValuesState,
		)
		// const initialValueOffsets = useRecoilValue(CausalInferenceBaselineOffsetsState);
		const causalInferenceResults = useRecoilValue(CausalInferenceResultState)
		const [interventions, setInterventions] = useRecoilState(
			CausalInterventionsState,
		)
		const min = (variable.min || 0) < 0 ? -1 : 0
		const inferenceResult = causalInferenceResults.get(variable.columnName)
		const unscaledValue = (
			(inferenceResult || 0) * (variable.magnitude || 0)
		).toFixed(2)
		// const scaledValue = inferenceResult?.toFixed(2);
		const rawDifferenceValue = differenceValues.get(variable.columnName) || 0
		const differenceValue = (
			rawDifferenceValue * (variable.magnitude || 0)
		).toFixed(2)
		const isIntervened = interventions.some(
			intervention => intervention.columnName === variable.columnName,
		)

		const updateInterventions = useCallback(
			(value: number) => {
				const revisedInterventions = interventions.filter(
					intervention => intervention.columnName !== variable.columnName,
				)
				revisedInterventions.push({ columnName: variable.columnName, value })
				setInterventions(revisedInterventions)
			},
			[interventions, setInterventions, variable.columnName],
		)

		const removeIntervention = useCallback(() => {
			if (wasDragged) {
				return
			}
			const revisedInterventions = interventions.filter(
				intervention => intervention.columnName !== variable.columnName,
			)
			setInterventions(revisedInterventions)
		}, [interventions, setInterventions, variable.columnName, wasDragged])

		return (
			<div>
				<Stack
					horizontal
					verticalAlign="center"
					horizontalAlign="space-between"
					tokens={slider_stack_tokens}
				>
					<IconButton
						iconProps={icon_button_props}
						onClick={removeIntervention}
						disabled={!isIntervened}
						style={icon_button_style}
					/>
					<Slider
						className="no-drag"
						min={min}
						max={1.0}
						value={inferenceResult || 0}
						step={0.01}
						styles={slider_style}
						onChange={updateInterventions}
					/>
					<Stack horizontalAlign="end">
						<Text variant="xSmall">{unscaledValue}</Text>
						{rawDifferenceValue !== 0 && (
							<Text
								variant="xSmall"
								style={
									rawDifferenceValue > 0
										? positive_change_text_style
										: negative_change_text_style
								}
							>{`(${differenceValue})`}</Text>
						)}
					</Stack>
				</Stack>
			</div>
		)
	},
)
