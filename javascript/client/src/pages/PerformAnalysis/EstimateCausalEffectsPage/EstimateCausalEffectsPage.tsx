/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Container, ContainerFlexRow, ContainerTextCenter } from '~styles'
import { Pages } from '~types'

import {
	useBusinessLogic,
	useInfoMessage,
	useMicrodataInfoMessage,
} from './hooks'
import { RunHistoryList } from './RunHistoryList'
import { SpecificationsList } from './SpecificationsList'

export const EstimateCausalEffects: React.FC = memo(
	function EstimateCausalEffects() {
		const InfoMessage = useInfoMessage()
		const MicrodataMessage = useMicrodataInfoMessage()

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
			loadingFile,
			hasConfidenceInterval,
			refutationOptions,
			isCanceled,
		} = useBusinessLogic()

		const hasErrorMessage = useMemo((): boolean => {
			return !!(InfoMessage || MicrodataMessage)
		}, [InfoMessage, MicrodataMessage])

		return (
			<Container>
				{InfoMessage}
				{MicrodataMessage}
				<SpecificationsList
					hasConfidenceInterval={hasConfidenceInterval}
					estimators={estimators}
					definitions={definitions?.definitions}
					refutationOptions={refutationOptions}
				/>
				<ContainerFlexRow justifyContent="center">
					<Button
						disabled={
							isProcessing ||
							!totalEstimatorsCount ||
							!specCount ||
							hasErrorMessage
						}
						onClick={runEstimate}
						data-pw="run-estimate-button"
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
					loadingFile={loadingFile}
					setRunAsDefault={setRunAsDefault}
					cancelRun={cancelRun}
					runHistory={runHistory}
					errors={errors}
					isCanceled={isCanceled}
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
