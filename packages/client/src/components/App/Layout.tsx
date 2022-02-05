/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, TooltipHost, MessageBarType } from '@fluentui/react'
import { useId } from '@fluentui/react-hooks'
import { memo, Suspense, useState } from 'react'
import styled from 'styled-components'
import { AppHeader } from '../AppHeader'
import { useProcessStepInfo, useGuidance, useOnClickProject } from './hooks'
import { StepControls, StepSelector } from '~components/GeneralSteps'
import { Guidance } from '~components/Guidance'
import { MessageContainer } from '~components/MessageContainer'
import { StepTitle } from '~components/StepTitle'
import {
	useExampleProjects,
	useGetStepUrls,
	useUploadZipMenuOption,
} from '~hooks'
import {
	useDefineQuestion,
	useSelectedProject,
	useSetStepStatuses,
} from '~state'
import { StyledSpinner } from '~styles'
import { Maybe } from '~types'

export const Layout: React.FC = memo(function Layout({ children }) {
	const [error, setError] = useState<Maybe<string>>()
	const handleGetStepUrls = useGetStepUrls()
	const handleSetAllStepStatus = useSetStepStatuses()
	const defineQuestion = useDefineQuestion()
	const exampleProjects = useExampleProjects()
	const uploadZipMenuOption = useUploadZipMenuOption(setError)
	const tooltipId = useId('tooltip')
	const project = useSelectedProject()
	const [isGuidanceVisible, toggleGuidance] = useGuidance()
	const onClickProject = useOnClickProject()
	const { step, stepStatus, onToggleStepStatus, previousStepUrl, nextStepUrl } =
		useProcessStepInfo()

	return (
		<Container>
			<AppHeader
				onGetStepUrls={handleGetStepUrls}
				onSetAllStepStatus={handleSetAllStepStatus}
				defineQuestion={defineQuestion}
				onClickProject={onClickProject}
				exampleProjects={exampleProjects}
				uploadZipMenuOption={uploadZipMenuOption}
			/>
			<PagesContainer>
				<StepsContainer>
					<TooltipHost
						content={`${isGuidanceVisible ? 'Hide' : 'Show'} Guidance`}
						id={tooltipId}
						styles={styles.tooltipHost}
					>
						<Button
							onClick={toggleGuidance}
							iconProps={styles.button}
							aria-describedby={tooltipId}
						/>
					</TooltipHost>
					<StepSelector project={project} />
				</StepsContainer>
				<GuidanceContainer isVisible={isGuidanceVisible}>
					<Guidance isVisible={isGuidanceVisible} step={step} />
				</GuidanceContainer>

				<Content>
					<StepTitle title="Workspace" />
					<ControlsContainer>
						<ChildrenContainer>
							{error ? (
								<MessageContainer
									onDismiss={() => setError(undefined)}
									type={MessageBarType.error}
									styles={{ margin: '1rem 0' }}
								>
									{error}
								</MessageContainer>
							) : null}
							<Suspense fallback={<StyledSpinner />}>{children}</Suspense>
						</ChildrenContainer>
						<StepControls
							step={step}
							stepStatus={stepStatus}
							nextUrl={nextStepUrl}
							previousUrl={previousStepUrl}
							toggleStatus={onToggleStepStatus}
						/>
					</ControlsContainer>
				</Content>
			</PagesContainer>
		</Container>
	)
})
const PagesContainer = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
`

const StepsContainer = styled.div`
	width: 17%;
	height: 100%;
	border-right: 1px solid ${({ theme }) => theme.application().lowContrast()};
	position: relative;
`

const ChildrenContainer = styled.div`
	padding: 0 16px;
	margin-bottom: 1rem;
`

const ControlsContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: space-between;
`

const GuidanceContainer = styled.div<{
	isVisible: Maybe<boolean>
}>`
	width: ${({ isVisible }) => (isVisible ? 23 : 0)}%;
	transition: 0.5s;
	border-right: 1px solid ${({ theme }) => theme.application().lowContrast()};
	height: 90vh;
	${({ isVisible }) => (!isVisible ? 'border: none;' : '')}
`

const Container = styled.div`
	margin: 0;
	height: 100vh;
	display: flex;
	flex-flow: column;
`

const Content = styled.div`
	flex: 1;
	display: flex;
	flex-flow: column;
	height: 100%;
	width: 50%;
`
const Button = styled(IconButton)`
	position: absolute;
	right: 0;
	color: white;
`

const styles = {
	tooltipHost: {
		root: { position: 'absolute' as const, right: 0, padding: '0 15px' },
	},
	button: { iconName: 'ReadingMode' },
}
