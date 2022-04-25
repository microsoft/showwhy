/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useDimensions } from '@essex/hooks'
import { DefaultButton } from '@fluentui/react'
import { Container, DetailsList, Title } from '@showwhy/components'
import { memo, useRef } from 'react'
import styled from 'styled-components'

import {
	useBusinessLogic,
	useHeaders,
} from './ConsiderRelevantVariablesPage.hooks'
import { RelevantVariablesForm } from './RelevantVariablesForm'

export const ConsiderRelevantVariablesPage: React.FC = memo(
	function ConsiderRelevantVariablesPage() {
		const { items, addFactor, goToFactorsPage, page } = useBusinessLogic()
		const ref = useRef(null)
		const dimensions = useDimensions(ref)
		const { width = 0 } = dimensions || {}
		const headers = useHeaders(width)

		return (
			<Container>
				<Container>
					<Title data-pw="title">Relevant variables</Title>
					<Container ref={ref}>
						<DetailsList items={items} headers={headers} />
					</Container>
				</Container>
				<RelevantVariablesForm onAdd={addFactor}></RelevantVariablesForm>
				{page ? (
					<ButtonContainer>
						<DefaultButton onClick={goToFactorsPage} data-pw="go-back-button">
							Go back to {page} page
						</DefaultButton>
					</ButtonContainer>
				) : null}
			</Container>
		)
	},
)

const ButtonContainer = styled.div`
	text-align: center;
	margin-top: 1rem;
`
