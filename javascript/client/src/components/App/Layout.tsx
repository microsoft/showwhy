/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageBarType } from '@fluentui/react'
import type { Maybe } from '@showwhy/types'
import { memo, Suspense, useState } from 'react'
import styled from 'styled-components'

import { StepControls, StepSelector } from '~components/GeneralSteps'
import { Guidance } from '~components/Guidance'
import { MessageContainer } from '~components/MessageContainer'
import { StepTitle } from '~components/StepTitle'
import { useExampleProjects, useUploadZipMenuOption } from '~hooks'
import { useExperiment, useSelectedProject } from '~state'
import { StyledSpinner } from '~styles'
import { Pages } from '~types'

import { AppHeader } from '../AppHeader'
import { useOnClickProject, useProcessStepInfo } from './hooks'

const noChildPadding = [Pages.ProcessData]

export const Layout: React.FC = memo(function Layout({ children }) {
	const [error, setError] = useState<Maybe<string>>()
	const defineQuestion = useExperiment()
	const exampleProjects = useExampleProjects()
	const uploadZipMenuOption = useUploadZipMenuOption(setError)
	const project = useSelectedProject()
	const onClickProject = useOnClickProject()
	const { step, previousStepUrl, nextStepUrl } = useProcessStepInfo()

	return (
		<Container>
			<AppHeader
				defineQuestion={defineQuestion}
				onClickProject={onClickProject}
				exampleProjects={exampleProjects}
				uploadZipMenuOption={uploadZipMenuOption}
			/>
			<PagesContainer>
				<Nav>
					<StepsContainer>
						<StepSelector project={project} />
					</StepsContainer>
					<GuidanceContainer>
						<Guidance step={step} />
					</GuidanceContainer>
				</Nav>

				<Content>
					<ControlsContainer>
						<StepTitle title="Workspace" />
						<ChildrenContainer
							noPadding={noChildPadding.includes(step?.url as Pages)}
							url={step?.url}
						>
							{error ? (
								<MessageContainer
									onDismiss={() => setError(undefined)}
									type={MessageBarType.error}
									styles={{ margin: '1rem 0' }}
								>
									{error}
								</MessageContainer>
							) : null}
							<Suspense fallback={<StyledSpinner data-pw="wait-spinner" />}>
								{children}
							</Suspense>
						</ChildrenContainer>
					</ControlsContainer>
					<StepControls nextUrl={nextStepUrl} previousUrl={previousStepUrl} />
				</Content>
			</PagesContainer>
		</Container>
	)
})
const PagesContainer = styled.div`
	display: flex;
	width: 100%;
	height: 94%;
`

const Nav = styled.div`
	max-width: 17vw;
	min-width: 12vw;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 2rem;
	overflow: hidden auto;
	border-right: 1px solid ${({ theme }) => theme.application().lowContrast()};
`

const StepsContainer = styled.div`
	position: relative;
`

const ChildrenContainer = styled.div<{ noPadding: boolean; url?: string }>`
	padding: ${({ noPadding }) => (noPadding ? '0' : '0 16px')};
	height: 95%;
	overflow-y: auto;
	margin-bottom: ${({ url }) => (url === '/prepare/data' ? 4 : 6)}rem;
`

const ControlsContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: flex-start;
`

const GuidanceContainer = styled.div`
	border-right: 1px solid ${({ theme }) => theme.application().lowContrast()};
	width: 100%;
`

const Container = styled.div`
	margin: 0;
	height: 100vh;
	display: flex;
	flex-flow: column;
	overflow-y: hidden;
`

const Content = styled.div`
	flex: 1;
	display: flex;
	flex-flow: column;
	height: 100%;
	width: 50%;
`
