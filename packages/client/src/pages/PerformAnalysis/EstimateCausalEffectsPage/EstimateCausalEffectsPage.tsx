/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { RunHistoryList } from './RunHistoryList'
import { SpecificationsList } from './SpecificationsList'
import { useBusinessLogic } from './hooks'
import { Pages } from '~enums'
import { ContainerFlexRow, ContainerTextCenter, Container } from '~styles'

export const EstimateCausalEffects: React.FC = memo(
	function EstimateCausalEffects() {
		const {
			isProcessing,
			totalEstimatorsCount,
			specCount,
			estimators,
			definitions,
			runHistory,
			errors,
			cancelRun,
			runEstimate,
			setRunAsDefault,
			loadingSpecCount,
			hasConfidenceInterval,
			refutationOptions,
		} = useBusinessLogic()

		return (
			<Container>
				<SpecificationsList
					hasConfidenceInterval={hasConfidenceInterval}
					estimators={estimators}
					definitions={definitions}
					refutationOptions={refutationOptions}
				/>
				<ContainerFlexRow justifyContent="center">
					<Button
						disabled={isProcessing || !totalEstimatorsCount || !specCount}
						onClick={runEstimate}
					>
						{isProcessing ? 'Loading...' : 'Run now'}
					</Button>
				</ContainerFlexRow>
				<ContainerTextCenter>
					<SpecificationLink
						disabled={!isProcessing}
						rel="noopener"
						to={Pages.SpecificationCurvePage}
					>
						See specification curve
					</SpecificationLink>
				</ContainerTextCenter>

				<RunHistoryList
					loadingSpecCount={loadingSpecCount}
					specCount={specCount}
					setRunAsDefault={setRunAsDefault}
					cancelRun={cancelRun}
					runHistory={runHistory}
					errors={errors}
				/>
			</Container>
		)
	},
)

const Button = styled(PrimaryButton)`
	margin: 8px;
	width: 50%;
`

const SpecificationLink = styled(Link)<{ disabled: boolean }>`
	pointer-events: ${({ disabled }) => (disabled ? 'none' : 'initial')};
	text-decoration: ${({ disabled }) => (disabled ? 'none' : 'underline')};
	color: ${({ theme, disabled }) =>
		disabled
			? theme.application().lowContrast().hex()
			: theme.application().accent().hex()};
`
