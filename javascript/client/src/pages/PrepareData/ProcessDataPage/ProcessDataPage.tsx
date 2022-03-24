/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@data-wrangling-components/react'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { CompletedElements } from './CompletedElements'
import { useBusinessLogic } from './hooks'
import { useTables } from './hooks/useTables'

export const ProcessDataPage: FC = memo(function ProcessDataPage() {
	const tables = useTables()
	const {
		onChangeSteps,
		steps,
		commandBar,
		elements,
		completedElements,
		allElements,
		isElementComplete,
		onResetVariable,
	} = useBusinessLogic()

	return (
		<Container>
			{allElements.length ? (
				<CompletedElements
					completedElements={completedElements}
					elements={elements}
					allElements={allElements}
					isElementComplete={isElementComplete}
					onResetVariable={onResetVariable}
				/>
			) : null}
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
	height: 99%;
	margin-top: 5px;
	position: relative;
	overflow-y: auto;

	> div {
		padding: 0;
	}
`
