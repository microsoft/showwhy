/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuItem } from '@fluentui/react'
import type { WorkflowHelp } from '@showwhy/components'
import { CausalQuestion } from '@showwhy/components'
import type { Experiment, Handler1 } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { Container } from '~styles'
import type { FileDefinition } from '~types'

import { ProjectsSelector } from './ProjectsSelector'
import { SaveProject } from './SaveProject'
import { UnderstandProcessButton } from './UnderstandProcessButton'

type ClickProjectHandler = Handler1<FileDefinition>

export const AppHeader: React.FC<{
	defineQuestion: Experiment
	exampleProjects: FileDefinition[]
	uploadZipMenuOption?: IContextualMenuItem
	onClickProject: ClickProjectHandler
	helpItems: WorkflowHelp[]
}> = memo(function AppHeader({
	defineQuestion,
	exampleProjects,
	uploadZipMenuOption,
	onClickProject,
	helpItems,
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
				<ProjectsSelector
					onClickProject={onClickProject}
					exampleProjects={exampleProjects}
					loadProjectOption={uploadZipMenuOption}
				/>
				<SaveProject />
				<UnderstandProcessButton items={helpItems} />
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
