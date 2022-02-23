/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@data-wrangling-components/react'
import { FC, memo } from 'react'
import styled from 'styled-components'
import { useBusinessLogic } from './hooks'

export const ProcessDataPage: FC = memo(function ProcessDataPage() {
	const { tables, onChangeSteps, steps, commandBar } = useBusinessLogic()

	return (
		<Container>
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
