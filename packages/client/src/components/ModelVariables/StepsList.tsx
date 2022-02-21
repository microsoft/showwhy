/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import { FC, memo } from 'react'
import styled from 'styled-components'
import { EmptyVariableSteps } from '~components/EmptyVariableSteps'
import { VariableDefinition } from '~types'
import { StepCard } from '@data-wrangling-components/react'

export const StepsList: FC<{
	selectedDefinitionId: string
	variables: VariableDefinition[]
}> = memo(function StepsList({ variables, selectedDefinitionId }) {
	return (
		<List>
			{!variables.find(x => x.id === selectedDefinitionId) && (
				<EmptyVariableSteps />
			)}
			{variables
				.find(x => x.id === selectedDefinitionId)
				?.steps.map((step: Step, index: number) => {
					return <StepCard index={index} step={step} />
				})}
		</List>
	)
})

const List = styled.div`
	display: flex;
	margin-bottom: 10px;
	margin-top: 5px;
	column-gap: 12px;
	width: 100%;
	overflow: auto;
`
