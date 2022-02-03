/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import { FC, memo } from 'react'
import styled from 'styled-components'
import { StepComponent } from './StepComponent'
import { EmptyVariableSteps } from '~components/EmptyVariableSteps'
import { VariableDefinition } from '~types'

interface StepsListProps {
	selectedDefinitionId: string
	variables: VariableDefinition[]
}
export const StepsList: FC<StepsListProps> = memo(function StepsList({
	variables,
	selectedDefinitionId,
}) {
	return (
		<List>
			{!variables.find(x => x.id === selectedDefinitionId) && (
				<EmptyVariableSteps />
			)}
			{variables
				.find(x => x.id === selectedDefinitionId)
				?.steps.map((step: Step, index: number) => {
					return <StepComponent key={index} step={step} />
				})}
		</List>
	)
})

const List = styled.div`
	display: flex;
`
