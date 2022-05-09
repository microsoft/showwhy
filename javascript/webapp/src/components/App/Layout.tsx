/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDimensions } from '@essex/hooks'
import { MessageBarType } from '@fluentui/react'
import {
	MessageContainer,
	StyledSpinner,
	WorkflowTitle,
} from '@showwhy/components'
import type { Maybe } from '@showwhy/types'
import { memo, Suspense, useMemo, useRef, useState } from 'react'
import { understandProcessSteps } from 'src/data/understandProcess'
import styled from 'styled-components'

import { StepControls, StepSelector } from '~components/GeneralSteps'
import { Pages } from '~constants'
import { useGuidance, useQuestion, useSelectedProject } from '~state'

import { AppHeader } from './components/AppHeader'
import { Guidance } from './components/Guidance'
import { useExampleProjects } from './hooks/useExampleProjects'
import { useLoadMenu } from './hooks/useLoadMenu'
import { useOnClickProject } from './hooks/useOnClickProject'
import { useProcessStepInfo } from './hooks/useProcessStepInfo'
import { useSaveProps } from './hooks/useSaveProps'
import { useUploadZipMenuOption } from './hooks/useUploadZipMenuOption'

const noChildPadding = [Pages.DeriveDataVariables]

export const Layout: React.FC = memo(function Layout({ children }) {
	const [isGuidanceVisible, toggleGuidance] = useGuidance()
	const [error, setError] = useState<Maybe<string>>()
	const question = useQuestion()
	const exampleProjects = useExampleProjects()
	const uploadZipMenuOption = useUploadZipMenuOption(setError)
	const project = useSelectedProject()
	const onClickProject = useOnClickProject()
	const { step, previousStepUrl, nextStepUrl } = useProcessStepInfo()
	const navRef = useRef(null)
	const stepsRef = useRef(null)
	const navDimensions = useDimensions(navRef)
	const saveProps = useSaveProps()
	const loadMenu = useLoadMenu(
		exampleProjects,
		uploadZipMenuOption,
		onClickProject,
	)
	const stepDimensions = useDimensions(stepsRef)
	const guidanceHeight = useMemo((): string => {
		if (navDimensions?.height && stepDimensions?.height) {
			return `${navDimensions.height - stepDimensions?.height}px`
		}
		return '100%'
	}, [navDimensions, stepDimensions])

	return (
		<Container>
			<AppHeader
				loadMenu={loadMenu}
				saveProps={saveProps}
				question={question}
				helpItems={understandProcessSteps}
			/>
			<PagesContainer>
				<Nav ref={navRef}>
					<StepsContainer ref={stepsRef}>
						<StepSelector project={project} />
					</StepsContainer>
					<GuidanceContainer h={guidanceHeight}>
						<Guidance
							isGuidanceVisible={isGuidanceVisible}
							toggleGuidance={toggleGuidance}
							step={step}
							maxHeight={guidanceHeight}
						/>
					</GuidanceContainer>
				</Nav>

				<Content>
					<ControlsContainer>
						<WorkflowTitle title="Workspace" />
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
	display: block;
	border-right: 1px solid ${({ theme }) => theme.application().lowContrast()};
	max-height: 94vh;
	overflow: hidden;
`

const StepsContainer = styled.div`
	position: relative;
	max-height: 80%;
	margin-bottom: 1rem;
`

const ChildrenContainer = styled.div<{ noPadding: boolean; url?: string }>`
	padding: ${({ noPadding }) => (noPadding ? '0' : '0 16px')};
	height: 95%;
	overflow-y: auto;
	margin-bottom: ${({ url }) => (url === Pages.DeriveDataVariables ? 4 : 5)}rem;
`

const ControlsContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: flex-start;
`

const GuidanceContainer = styled.div<{ h: string }>`
	border-right: 1px solid ${({ theme }) => theme.application().lowContrast()};
	width: 100%;
	height: ${({ h }) => h};
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
