/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@data-wrangling-components/react'
import { ProgressIndicator } from '@fluentui/react'
import { FC, memo } from 'react'
import styled from 'styled-components'
import { percentage } from '~utils/stats'
import { useBusinessLogic } from './hooks'

export const ProcessDataPage: FC = memo(function ProcessDataPage() {
	const {
		tables,
		onChangeSteps,
		steps,
		commandBar,
		elements,
		completedElements,
	} = useBusinessLogic()

	return (
		<Container>
			<ProgressContainer>
				<ProgressIndicator
					label="Variables definition"
					description={`Completed ${completedElements}/${elements}`}
					percentComplete={percentage(completedElements, elements) / 100}
				/>
			</ProgressContainer>
			<PrepareDataFull
				steps={steps}
				onUpdateSteps={onChangeSteps}
				tables={tables}
				outputHeaderCommandBar={[commandBar]}
			/>
		</Container>
	)
})

const Container = styled.div`
	height: 100%;
	margin-top: 0.5rem;
`

const ProgressContainer = styled.div`
	width: 98%;
	margin: 0 10px 10px 10px;
`
