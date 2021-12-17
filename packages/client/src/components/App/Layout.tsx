/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, TooltipHost } from '@fluentui/react'
import React, { memo, Suspense } from 'react'
import styled from 'styled-components'
import { AppHeader } from '../AppHeader'
import { useLayout } from './hooks'
import { StepControls, StepSelector } from '~components/GeneralSteps'
import { Guidance } from '~components/Guidance'
import { StepTitle } from '~components/StepTitle'
import { UploadZip } from '~components/UploadZip'
import { StyledSpinner } from '~styles'

export const Layout: React.FC = memo(function Layout({ children }) {
	const {
		handleGetStepUrls,
		handleSetAllStepStatus,
		defineQuestion,
		tooltipId,
		isGuidanceVisible,
		toggleGuidance,
		project,
		step,
		stepStatus,
		toggleStatus,
		previousUrl,
		nextUrl,
		goToPage,
		onClickProject,
		exampleProjects,
		uploadZipMenuOption,
		uploadZipButtonId,
		handleFiles,
	} = useLayout()

	return (
		<Container>
			<UploadZip id={uploadZipButtonId} onUpload={handleFiles} />
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
						styles={{
							root: { position: 'absolute', right: 0, padding: '0 15px' },
						}}
					>
						<Button
							onClick={toggleGuidance}
							iconProps={{ iconName: 'ReadingMode' }}
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
							<Suspense fallback={<StyledSpinner />}>{children}</Suspense>
						</ChildrenContainer>
						<StepControls
							step={step}
							stepStatus={stepStatus}
							goToPage={goToPage}
							nextUrl={nextUrl}
							previousUrl={previousUrl}
							toggleStatus={toggleStatus}
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
	isVisible: boolean | undefined
}>`
	width: ${({ isVisible }) => (isVisible ? 23 : 0)}%;
	transition: 0.5s;
	border-right: 1px solid ${({ theme }) => theme.application().lowContrast()};
	height: 90vh;
	${({ isVisible }) =>
		!isVisible
			? 'border: none;'
			: ''}// This is for resizing, but behaves weird in the graph page
	// resize: horizontal;
	// overflow: hidden;
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
