/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Expando } from '@essex/components'
import { Pivot, PivotItem, Position, SpinButton } from '@fluentui/react'
import { useDebounceFn } from 'ahooks'
import { memo, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import type {
	DECIAlgorithmParams,
	DECITrainingOptions,
} from '../domain/Algorithms/DECI.js'
import { DeciParamsState } from '../state/atoms/algorithms_params.js'
import { DeciAteParams } from './DeciAteParams.js'
import { DeciModelParams } from './DeciModelParams.js'
import { defaultTrainingSpinningOptions } from './DeciParams.constants.js'
import {
	useOnChangeATEDetails,
	useOnChangeBooleanOption,
	useOnChangeCateOption,
	useOnChangeChoiceGroupOption,
	useOnChangeNumberListOption,
	useOnChangeNumberOption,
} from './DeciParams.hooks.js'
import { Container, SpinContainer } from './DeciParams.styles.js'
import { DeciTrainingParams } from './DeciTrainingParams.js'

export const DeciParams: React.FC = memo(function DeciParams() {
	const [stateDeciParams, setStateDeciParams] = useRecoilState(DeciParamsState)
	const [deciParams, setDeciParams] = useState(stateDeciParams)

	const updateState = useDebounceFn(
		(value: DECIAlgorithmParams) => {
			setStateDeciParams(value)
		},
		{ wait: 500 },
	)

	useEffect(() => {
		updateState.run(deciParams) // eslint-disable-line
	}, [deciParams, updateState])

	const onChangeNumberOption = useOnChangeNumberOption(setDeciParams)
	const onChangeBooleanOption = useOnChangeBooleanOption(setDeciParams)
	const onChangeChoiceGroupOption = useOnChangeChoiceGroupOption(setDeciParams)
	const onChangeNumberListOptions = useOnChangeNumberListOption(setDeciParams)
	const onChangeCate = useOnChangeCateOption(setDeciParams)
	const onChangeATEDetails = useOnChangeATEDetails(setDeciParams)

	return (
		<Container>
			<SpinContainer>
				{defaultTrainingSpinningOptions.map(x => (
					<SpinButton
						label={x.label}
						key={x.inputProps?.name}
						labelPosition={Position.top}
						value={
							deciParams?.training_options?.[
								x.inputProps?.name as keyof DECITrainingOptions
							]?.toString() || x.defaultValue
						}
						onChange={(_, val?: string) =>
							onChangeNumberOption('training_options', val, x.inputProps?.name)
						}
						min={x.min}
						max={x.max}
						step={x.step}
						incrementButtonAriaLabel="Increase value by 1"
						decrementButtonAriaLabel="Decrease value by 1"
					/>
				))}
			</SpinContainer>

			<Expando label="Advanced options">
				<Pivot aria-label="Advanced options">
					<PivotItem headerText="Training">
						<DeciTrainingParams
							values={deciParams}
							onChangeBoolean={onChangeBooleanOption}
							onChangeNumber={onChangeNumberOption}
							onChangeChoiceGroup={onChangeChoiceGroupOption}
						/>
					</PivotItem>
					<PivotItem headerText="Model">
						<DeciModelParams
							onChangeBoolean={onChangeBooleanOption}
							onChangeNumber={onChangeNumberOption}
							onChangeChoiceGroup={onChangeChoiceGroupOption}
							onChangeCate={onChangeCate}
							onChangeNumberList={onChangeNumberListOptions}
							values={deciParams}
						/>
					</PivotItem>
					<PivotItem headerText="ATE">
						<DeciAteParams
							onChangeNumber={onChangeNumberOption}
							onChangeBoolean={onChangeBooleanOption}
							onChangeATEDetails={onChangeATEDetails}
							values={deciParams}
						/>
					</PivotItem>
				</Pivot>
			</Expando>
		</Container>
	)
})
