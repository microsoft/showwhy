/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'
import { Checkbox, ChoiceGroup, Position, SpinButton } from '@fluentui/react'
import { memo } from 'react'

import type {
	DECIParams,
	DECITrainingOptions,
} from '../domain/Algorithms/DECI.js'
import {
	Container,
	ContainerAdvancedCheckbox,
	ContainerAdvancedGrid,
} from './DeciParams.styles.js'
import type { onChangeBooleanFn, onChangeStringFn } from './DeciParams.types.js'
import {
	advancedTrainingAnnealChoiceOptions,
	advancedTrainingBooleanOptions,
	advancedTrainingSpinningOptions,
	ANNEAL_ENTROPY,
} from './DeciTrainingParams.constants.js'

interface DeciTrainingParamsProps {
	values: DECIParams
	onChangeNumber: onChangeStringFn
	onChangeBoolean: onChangeBooleanFn
	onChangeChoiceGroup: onChangeStringFn
}
export const DeciTrainingParams: React.FC<DeciTrainingParamsProps> = memo(
	function DeciTrainingParams({
		values,
		onChangeNumber,
		onChangeBoolean,
		onChangeChoiceGroup,
	}) {
		return (
			<Container>
				<ContainerAdvancedGrid>
					{advancedTrainingSpinningOptions.map(x => (
						<SpinButton
							key={x.inputProps?.name}
							label={x.label}
							labelPosition={Position.top}
							onChange={(_, val?: string) =>
								onChangeNumber('training_options', val, x.inputProps?.name)
							}
							value={
								values?.training_options?.[
									x.inputProps?.name as keyof DECITrainingOptions
								]?.toString() || x.defaultValue
							}
							min={0}
							step={x.step}
							incrementButtonAriaLabel="Increase value by 1"
							decrementButtonAriaLabel="Decrease value by 1"
						/>
					))}
				</ContainerAdvancedGrid>
				<ContainerAdvancedCheckbox>
					{advancedTrainingBooleanOptions.map(x => (
						<Checkbox
							label={x.label}
							key={x.name}
							checked={
								(values?.training_options?.[
									x.name as keyof DECITrainingOptions
								] ?? x.checked) as boolean
							}
							onChange={(_, val?: boolean) =>
								onChangeBoolean('training_options', val, x.name)
							}
						/>
					))}
				</ContainerAdvancedCheckbox>
				<ChoiceGroup
					selectedKey={
						values?.training_options?.anneal_entropy || ANNEAL_ENTROPY
					}
					options={advancedTrainingAnnealChoiceOptions}
					onChange={(_, opt?: IChoiceGroupOption) =>
						onChangeChoiceGroup('training_options', opt?.key, 'anneal_entropy')
					}
					label="Anneal entropy"
				/>
			</Container>
		)
	},
)
