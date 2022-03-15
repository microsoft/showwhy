/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuItem } from '@fluentui/react'
import type { Experiment, Handler1 } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { CausalQuestion } from '~components/CausalQuestion'
import { Container } from '~styles'
import type { FileDefinition, StepStatus } from '~types'

import { ProjectsSelector } from './ProjectsSelector'
import { SaveProject } from './SaveProject'
import { Settings } from './Settings'

type GetStepUrlsHandler = (urls?: string[], exclude?: any) => string[]
type SetAllStepStatusHandler = (urls: string[], status: StepStatus) => void
type ClickProjectHandler = Handler1<FileDefinition>

export const AppHeader: React.FC<{
	defineQuestion: Experiment
	exampleProjects: FileDefinition[]
	uploadZipMenuOption?: IContextualMenuItem
	onGetStepUrls: GetStepUrlsHandler
	onSetAllStepStatus: SetAllStepStatusHandler
	onClickProject: ClickProjectHandler
}> = memo(function AppHeader({
	defineQuestion,
	exampleProjects,
	uploadZipMenuOption,
	onGetStepUrls,
	onClickProject,
	onSetAllStepStatus,
}) {
	return (
		<AppHeaderContainer>
			<TitleContainer>
				<Title data-pw="main-title">ShowWhy</Title>
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
`

const Title = styled.h3`
	padding: 0px 16px;
`

const UserInformationContainer = styled.div`
	display: flex;
`
