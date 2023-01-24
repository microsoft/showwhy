/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Expando } from '@essex/components'
import { Position, SpinButton } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilValue } from 'recoil'

import { InModelCausalVariablesState } from '../state/index.js'
import {
	spinValueToNumber,
	useAllowEmptyValidation,
} from '../utils/ChangeEvents.js'
import { useFilteredCausalVariables } from './DeciATEDetailsParams.hooks.js'
import {
	ATEDetailsContainer,
	Container,
	StyledLabel,
} from './DeciATEDetailsParams.styles.js'
import type { DeciATEDetailsParamsProps } from './DeciATEDetailsParams.types.js'

export const DeciATEDetailsParams: React.FC<DeciATEDetailsParamsProps> = memo(
	function DeciATEDetailsParams({ ateDetailsByName, onChangeATEDetails }) {
		const causalVariables = useFilteredCausalVariables(
			useRecoilValue(InModelCausalVariablesState),
		)
		const allowEmptyValidation = useAllowEmptyValidation()

		if (causalVariables.length === 0) {
			return <></>
		}

		return (
			<Container>
				<StyledLabel>Intervention/Reference values</StyledLabel>
				{causalVariables.map(v => (
					<Expando key={v.name} label={v.name}>
						<ATEDetailsContainer>
							<SpinButton
								label={'Intervention'}
								labelPosition={Position.top}
								value={
									ateDetailsByName?.[v.name]?.intervention?.toString() || ''
								}
								onChange={(_event, newValue) => {
									onChangeATEDetails(v.name, {
										...ateDetailsByName?.[v.name],
										intervention: spinValueToNumber(newValue),
									})
								}}
								onValidate={allowEmptyValidation}
								step={1}
								incrementButtonAriaLabel="Increase value by 1"
								decrementButtonAriaLabel="Decrease value by 1"
							/>
							<SpinButton
								label={'Reference'}
								labelPosition={Position.top}
								value={ateDetailsByName?.[v.name]?.reference?.toString() || ''}
								onChange={(_event, newValue) => {
									onChangeATEDetails(v.name, {
										...ateDetailsByName?.[v.name],
										reference: spinValueToNumber(newValue),
									})
								}}
								onValidate={allowEmptyValidation}
								step={1}
								incrementButtonAriaLabel="Increase value by 1"
								decrementButtonAriaLabel="Decrease value by 1"
							/>
						</ATEDetailsContainer>
					</Expando>
				))}
			</Container>
		)
	},
)
