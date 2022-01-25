/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IContextualMenuItem } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { ProjectsSelector } from './ProjectsSelector'
import { SaveProject } from './SaveProject'
import { Settings } from './Settings'
import { CausalQuestion } from '~components/CausalQuestion'
import { StepStatus, Experiment, FileDefinition } from '~interfaces'
import { Container } from '~styles'

interface AppHeaderProps {
	onGetStepUrls: (urls?: string[], exclude?: any) => string[]
	onSetAllStepStatus: (urls: string[], status: StepStatus) => void
	defineQuestion: Experiment
	onClickProject: (example: FileDefinition) => void
	exampleProjects: FileDefinition[]
	uploadZipMenuOption?: IContextualMenuItem
}

export const AppHeader: React.FC<AppHeaderProps> = memo(function AppHeader({
	onGetStepUrls,
	onSetAllStepStatus,
	defineQuestion,
	onClickProject,
	exampleProjects,
	uploadZipMenuOption,
}) {
	return (
		<AppHeaderContainer>
			<TitleContainer>
				<Title>ShowWhy</Title>
			</TitleContainer>
			<Container>
				<CausalQuestion defineQuestion={defineQuestion} />
			</Container>
			<UserInformationContainer>
				<Settings
					onGetStepUrls={onGetStepUrls}
					onSetAllStepStatus={onSetAllStepStatus}
				/>
				<ProjectsSelector
					onClickProject={onClickProject}
					exampleProjects={exampleProjects}
					loadProjectOption={uploadZipMenuOption}
				/>
				<SaveProject />
			</UserInformationContainer>
		</AppHeaderContainer>
	)
})

const AppHeaderContainer = styled.div`
	background: ${({ theme }) => theme.application().accent};
	display: flex;
	align-items: center;
	color: white;
	justify-content: space-between;
`

const TitleContainer = styled.div`
	width: 17%;
	border-right: 1px solid rgba(255, 255, 255, 0.5);
`

const Title = styled.h3`
	padding: 0px 16px;
`

const UserInformationContainer = styled.div`
	display: flex;
`
