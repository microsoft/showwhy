/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuProps } from '@fluentui/react'
import type { Experiment } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { CausalQuestion } from '../CausalQuestion'
import { Container } from '../styles'
import type { WorkflowHelp } from '../UnderstandProcessModal'
import { ProjectsSelector } from './ProjectsSelector'
import { SaveProject } from './SaveProject'
import { UnderstandProcessButton } from './UnderstandProcessButton'

export const AppHeader: React.FC<{
	defineQuestion: Experiment
	loadMenu: IContextualMenuProps
	helpItems: WorkflowHelp[]
	saveProps: IContextualMenuProps
}> = memo(function AppHeader({
	defineQuestion,
	loadMenu,
	helpItems,
	saveProps,
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
				<ProjectsSelector loadMenu={loadMenu} />
				<SaveProject saveProps={saveProps} />
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
