/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Slider, Stack, Text } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import { useRecoilState } from 'recoil'

import { VariableNature } from '../../domain/VariableNature.js'
import { CausalInterventionsState } from '../../state/index.jsx'
import {
	icon_button_props,
	icon_button_style,
	negative_change_text_style,
	positive_change_text_style,
	slider_stack_tokens,
	slider_style,
} from './CausalInferenceSlider.constants.js'
import {
	useCausalInferenceDifferenceFromBaselineValues,
	useInferenceResult,
} from './CausalInferenceSlider.hooks.js'
import type { CausalInferenceSliderProps } from './CausalInferenceSlider.types.js'

const categoricalNatures = [
	VariableNature.CategoricalNominal,
	VariableNature.CategoricalOrdinal,
	VariableNature.Discrete,
]

export const CausalInferenceSlider: React.FC<CausalInferenceSliderProps> = memo(
	function CausalInferenceSlider({ variable, wasDragged, columnMetadata }) {
		const isCategorical =
			variable?.nature && categoricalNatures.includes(variable?.nature)

		const differenceValues = useCausalInferenceDifferenceFromBaselineValues()
		const metadata = columnMetadata && columnMetadata[variable.columnName]

		const inferenceResult = useInferenceResult(variable.columnName)
		const [interventions, setInterventions] = useRecoilState(
			CausalInterventionsState,
		)

		const rawDifferenceValue = differenceValues.get(variable.columnName) || 0

		const unscaledValue = (inferenceResult || 0).toFixed(2)
		const differenceValue = rawDifferenceValue.toFixed(2)

		const isIntervened = interventions.some(
			intervention => intervention.columnName === variable.columnName,
		)

		const filteredInterventions = useMemo(() => {
			return interventions.filter(
				intervention => intervention.columnName !== variable.columnName,
			)
		}, [interventions, variable])

		const updateInterventions = useCallback(
			(value: number) => {
				const revisedInterventions = [...filteredInterventions]
				revisedInterventions.push({
					columnName: variable.columnName,
					value: value,
				})
				setInterventions(revisedInterventions)
			},
			[filteredInterventions, setInterventions, variable.columnName],
		)

		const removeIntervention = useCallback(() => {
			if (wasDragged) {
				return
			}
			setInterventions(filteredInterventions)
		}, [filteredInterventions, setInterventions, wasDragged])

		if (isCategorical) return null
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
					{/* min and max values are by default 0 and 1 because of binary data, they don't have lower and upper */}
					<Slider
						className="no-drag"
						min={metadata?.lower ?? 0}
						max={metadata?.upper ?? 1}
						value={+unscaledValue || 0}
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
