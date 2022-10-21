/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Position, SpinButton } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'

import { DeciParamsState } from '../state/atoms/algorithms_params.js'

export const DeciParams: React.FC = memo(function DeciParams() {
	const [deciParams, setDeciParams] = useRecoilState(DeciParamsState)

	const onChangeTrainingOptionsSpinValue = useCallback(
		(val?: string, name?: string) => {
			if (!val || !name) return
			setDeciParams(curr => ({
				...curr,
				training_options: {
					...curr.training_options,
					[name]: +val,
				},
			}))
		},
		[setDeciParams],
	)

	const onChangeSteps = useCallback(
		(_: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
			onChangeTrainingOptionsSpinValue(newValue, 'max_steps_auglag')
		},
		[onChangeTrainingOptionsSpinValue],
	)

	const onChangeEpochs = useCallback(
		(_: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
			onChangeTrainingOptionsSpinValue(newValue, 'max_auglag_inner_epochs')
		},
		[onChangeTrainingOptionsSpinValue],
	)

	return (
		<Container>
			<SpinButton
				label="max_steps_auglag"
				labelPosition={Position.top}
				defaultValue={deciParams.training_options.max_steps_auglag.toString()}
				onChange={onChangeSteps}
				min={1}
				step={1}
				incrementButtonAriaLabel="Increase value by 1"
				decrementButtonAriaLabel="Decrease value by 1"
			/>
			<SpinButton
				label="max_auglag_inner_epochs"
				labelPosition={Position.top}
				onChange={onChangeEpochs}
				defaultValue={deciParams.training_options.max_auglag_inner_epochs.toString()}
				min={1}
				step={1}
				incrementButtonAriaLabel="Increase value by 1"
				decrementButtonAriaLabel="Decrease value by 1"
			/>
		</Container>
	)
})

const Container = styled.div``
