/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { round } from 'lodash'
import { memo } from 'react'
import styled from 'styled-components'

import type { Handler } from '../types/primitives.js'
import type { RefutationOption } from '../types/refutation/RefutationOption.js'
import { RefutationTestMethodString } from '../types/refutation/RefutationTestMethodString.js'
import type { Specification } from '../types/visualization/Specification.js'
import { pluralize } from '../utils/lang.js'
import { CovariateBalanceDetails } from './CovariateBalanceDetails.js'
import { RefutationOptionsCallout } from './RefutationOptionsCallout.js'
import { SpecificationDetails } from './SpecificationDetails.js'
import { Paragraph, Text } from './styles.js'
/* eslint-disable */

export const SpecificationDescription: React.FC<{
	specification?: Specification
	refutationOptions: RefutationOption[]
	isSpecificationOn: boolean
	refutationNumbers: string
	failedRefutations: string[]
	onToggleRejectEstimate: Handler
	confounderThreshold?: number
}> = memo(function SpecificationDescription({
	specification,
	refutationOptions,
	isSpecificationOn,
	refutationNumbers,
	failedRefutations,
	onToggleRejectEstimate,
	confounderThreshold,
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
						<Value>{specification.population}</Value> and outcome
						<Value>{specification.outcome}</Value>
						is
						<Effect>{round(specification.estimatedEffect, 3)}</Effect>
						<SpecificationDetails
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
											key={refutation}
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
						<CovariateBalanceDetails
							confounderThreshold={confounderThreshold}
							specification={specification}
						/>
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
	color: ${({ theme }) => theme.palette.neutralSecondary};
`

const Effect = styled(Value)`
	&:after {
		content: '';
	}
	color: ${({ theme }) => theme.palette.themePrimary};
`
