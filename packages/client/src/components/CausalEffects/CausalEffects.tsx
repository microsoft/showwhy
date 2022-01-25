/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import { memo } from 'react'

import styled from 'styled-components'
import { ComponentArrows } from './ComponentArrows'
import { CausalEffectSize } from '~interfaces'
import { Container, Paragraph } from '~styles'

export interface CausalEffectsProps {
	size?: CausalEffectSize
	confounders: string[]
	outcomeDeterminants: string[]
	generalExposure: string
	generalOutcome: string
	excludedFactors: string[]
	excludedMessage: string
}

export const CausalEffects: React.FC<CausalEffectsProps> = memo(
	function CausalEffects({
		size = CausalEffectSize.Medium,
		confounders,
		outcomeDeterminants,
		generalExposure,
		generalOutcome,
		excludedFactors,
		excludedMessage,
	}) {
		return (
			<Container>
				<ComponentArrows
					size={size}
					confounders={confounders}
					outcomeDeterminants={outcomeDeterminants}
					exposure={generalExposure}
					outcome={generalOutcome}
				/>
				{excludedFactors.length ? (
					<ExcludedContainer>
						<Paragraph>
							<FluentIcon iconName="info"></FluentIcon>
							{excludedMessage}
						</Paragraph>
					</ExcludedContainer>
				) : null}
			</Container>
		)
	},
)

const FluentIcon = styled(Icon)`
	vertical-align: bottom;
	margin-right: 4px;
`

const ExcludedContainer = styled.div`
	margin-top: 16px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 4px;
	padding: 8px;
	border: 1px solid ${({ theme }) => theme.application().lowContrast()};
`
