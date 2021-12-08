/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { ProjectsSelector } from './ProjectsSelector'
import { SaveProject } from './SaveProject'
import { Settings } from './Settings'
import { CausalQuestion } from '~components/CausalQuestion'
import { DescribeElements } from '~interfaces'
import { Container } from '~styles'
import { GenericFn } from '~types'

interface AppHeaderProps {
	onGetStepUrls: GenericFn
	onSetAllStepStatus: GenericFn
	defineQuestion: DescribeElements
}

export const AppHeader: React.FC<AppHeaderProps> = memo(function AppHeader({
	onGetStepUrls,
	onSetAllStepStatus,
	defineQuestion,
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
				<ProjectsSelector />
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
