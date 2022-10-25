/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Slider, Stack, Text } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilValue } from 'recoil'

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
	useDifferenceValue,
	useInferenceResult,
	useOnRemoveInterventions,
	useOnUpdateInterventions,
} from './CausalInferenceSlider.hooks.js'
import type { CausalInferenceSliderProps } from './CausalInferenceSlider.types.js'

const categoricalNatures = [
	VariableNature.CategoricalNominal,
	VariableNature.CategoricalOrdinal,
	VariableNature.Discrete,
]

export const CausalInferenceSlider: React.FC<CausalInferenceSliderProps> = memo(
	function CausalInferenceSlider({ variable, columnMetadata }) {
		const inferenceResult = useInferenceResult(variable.columnName)
		const differenceValue = useDifferenceValue(variable.columnName)
		const isCategorical =
			variable?.nature && categoricalNatures.includes(variable?.nature)
		const interventions = useRecoilValue(CausalInterventionsState)

		const metadata = columnMetadata && columnMetadata[variable.columnName]
		const unscaledValue = (inferenceResult || 0).toFixed(2)
		const isIntervened = interventions.some(
			intervention => intervention.columnName === variable.columnName,
		)

		const onUpdateInterventions = useOnUpdateInterventions(
			variable.columnName,
			interventions,
		)
		const onRemoveIntervention = useOnRemoveInterventions(
			variable.columnName,
			interventions,
		)

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
						onClick={onRemoveIntervention}
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
						onChange={onUpdateInterventions}
					/>
					<Stack horizontalAlign="end">
						<Text variant="xSmall">{unscaledValue}</Text>
						{+differenceValue !== 0 && (
							<Text
								variant="xSmall"
								style={
									+differenceValue > 0
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
