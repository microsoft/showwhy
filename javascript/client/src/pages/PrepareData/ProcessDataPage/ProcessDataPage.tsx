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
import { useOnUpdateTables } from './hooks/useOnUpdateTables'
import { useTables } from './hooks/useTables'

export const ProcessDataPage: FC = memo(function ProcessDataPage() {
	const tables = useTables()
	const onUpdateTables = useOnUpdateTables()
	const { onChangeSteps, steps, commandBar, elements, completedElements, allElements, isElementComplete } =
		useBusinessLogic()

	return (
		<Container>
			{completedElements ? 
				<CompletedElements
					completedElements={completedElements}
					elements={elements}
					allElements={allElements}
					isElementComplete={isElementComplete}
				/>
			: null}
			<PrepareDataFull
				steps={steps}
				onUpdateSteps={onChangeSteps}
				tables={tables}
				onUpdateTables={onUpdateTables}
				outputHeaderCommandBar={[commandBar]}
			/>
		</Container>
	)
})

const Container = styled.div`
	height: 100vh;
	margin-top: 0.5rem;
	position: relative;
	overflow: hidden;
`
