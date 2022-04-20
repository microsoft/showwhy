/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { Paragraph, Text } from '@showwhy/components'
import type { Handler, RefutationOption, Specification } from '@showwhy/types'
import { RefutationTestMethodString } from '@showwhy/types'
import { round } from 'lodash'
import { memo } from 'react'
import styled from 'styled-components'

import { pluralize } from '~utils'

import { EstimateDetails } from './EstimateDetails'
import { RefutationOptionsCallout } from './RefutationOptionsCallout'

export const SpecificationDescription: React.FC<{
	specification?: Specification
	refutationOptions: RefutationOption[]
	isSpecificationOn: boolean
	refutationNumbers: string
	failedRefutations: string[]
	onToggleRejectEstimate: Handler
}> = memo(function SpecificationDescription({
	specification,
	refutationOptions,
	isSpecificationOn,
	refutationNumbers,
	failedRefutations,
	onToggleRejectEstimate,
}) {
	return (
		<Container>
			{specification ? (
				<>
					<Paragraph noMarginTop data-pw="selected-specification-text">
						Specification
						<Value>{specification.id}</Value>uses a
						<Value>{specification.causalModel}</Value>
						causal model and a<Value>{specification.estimator}</Value>
						estimator. The estimated effect of exposure
						<Value>{specification.treatment}</Value> for population
						<Value>{specification.population}</Value>
						is
						<Effect>{round(specification.estimatedEffect, 3)}</Effect>
						<EstimateDetails
							c95Lower={specification?.c95Lower}
							c95Upper={specification?.c95Upper}
							populationSize={specification?.populationSize}
						/>
						{refutationNumbers === '0/0' ? (
							<Text>
								This estimate has not been validated against refutation tests.
							</Text>
						) : (
							<Text>
								This estimate passed <Value>{refutationNumbers}</Value>{' '}
								refutations
								{failedRefutations.length > 0
									? `, failing on the following test${pluralize(
											failedRefutations.length,
									  )}: `
									: ''}
								{failedRefutations.map((refutation, index) => {
									return (
										<RefutationOptionsCallout
											key={index}
											calloutKey={index}
											title={(RefutationTestMethodString as any)[refutation]}
											refutationOptions={refutationOptions}
											separate={index > 0}
										/>
									)
								})}
								.
							</Text>
						)}
					</Paragraph>
					<ToggleButton
						onClick={onToggleRejectEstimate}
						data-pw="toggle-estimate-button"
					>
						{isSpecificationOn ? 'Reject estimate' : 'Accept estimate'}
					</ToggleButton>
				</>
			) : null}
		</Container>
	)
})

const Container = styled.div``

const ToggleButton = styled(DefaultButton)`
	min-width: 144px;
`

const Value = styled.span`
	font-weight: bold;
	&:before {
		content: ' ';
	}
	&:after {
		content: ' ';
	}
	color: ${({ theme }) => theme.application().midContrast().hex()};
`

const Effect = styled(Value)`
	&:after {
		content: '';
	}
	color: ${({ theme }) => theme.application().accent().hex()};
`
