/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuProps } from '@fluentui/react'
import { CausalQuestion, Container } from '@showwhy/components'
import type { Question, WorkflowHelp } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'
import { AppHeaderMenu } from './AppHeaderMenu'
import { UnderstandProcessButton } from './UnderstandProcessButton'

export const AppHeader: React.FC<{
	question: Question
	loadMenu: IContextualMenuProps
	helpItems: WorkflowHelp[]
	saveProps: IContextualMenuProps
}> = memo(function AppHeader({ question, loadMenu, helpItems, saveProps }) {
	return (
		<AppHeaderContainer>
			<TitleContainer>
				<Title data-pw="main-title">ShowWhy</Title>
			</TitleContainer>
			<Container>
				<CausalQuestion question={question} />
			</Container>
			<UserInformationContainer>
				<AppHeaderMenu menuProps={loadMenu} text="Load" />
				<AppHeaderMenu menuProps={saveProps} text="Save" />
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
