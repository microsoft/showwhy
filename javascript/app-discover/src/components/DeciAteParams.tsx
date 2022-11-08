/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, Position, SpinButton } from '@fluentui/react'
import { memo } from 'react'

import type { DECIAteOptions, DECIParams } from '../domain/Algorithms/DECI.js'
import {
	advancedAteBooleanOptions,
	advancedAteSpinningOptions,
} from './DeciAteParams.constants.js'
import {
	Container,
	ContainerAdvancedCheckbox,
	ContainerAdvancedGrid,
} from './DeciParams.styles.js'
import type { onChangeBooleanFn, onChangeStringFn } from './DeciParams.types.js'

interface DeciAteParamsProps {
	values: DECIParams
	onChangeNumber: onChangeStringFn
	onChangeBoolean: onChangeBooleanFn
}
export const DeciAteParams: React.FC<DeciAteParamsProps> = memo(
	function DeciAteParams({ values, onChangeNumber, onChangeBoolean }) {
		return (
			<Container>
				<ContainerAdvancedGrid>
					{advancedAteSpinningOptions.map(x => (
						<SpinButton
							key={x.inputProps?.name}
							label={x.label}
							labelPosition={Position.top}
							onChange={(_, val?: string) =>
								onChangeNumber('ate_options', val, x.inputProps?.name)
							}
							value={
								values?.ate_options?.[
									x.inputProps?.name as keyof DECIAteOptions
								]?.toString() || x.defaultValue
							}
							min={1}
							step={x.step}
							incrementButtonAriaLabel="Increase value by 1"
							decrementButtonAriaLabel="Decrease value by 1"
						/>
					))}
				</ContainerAdvancedGrid>
				<ContainerAdvancedCheckbox>
					{advancedAteBooleanOptions.map(x => (
						<Checkbox
							label={x.label}
							key={x.name}
							checked={
								(values?.ate_options?.[x.name as keyof DECIAteOptions] ??
									x.checked) as boolean
							}
							onChange={(_, val?: boolean) =>
								onChangeBoolean('ate_options', val, x.name)
							}
						/>
					))}
				</ContainerAdvancedCheckbox>
			</Container>
		)
	},
)
