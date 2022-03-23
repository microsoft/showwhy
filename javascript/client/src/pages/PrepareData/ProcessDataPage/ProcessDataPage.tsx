/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@data-wrangling-components/react'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { BaseCallout } from '~components/Callout'

import { AddVariableFields } from './AddVariableFields'
import { CompletedElements } from './CompletedElements'
import { useBusinessLogic } from './hooks'
import { useAddVariable } from './hooks/useAddVariable'
import { useTables } from './hooks/useTables'

export const ProcessDataPage: FC = memo(function ProcessDataPage() {
	const tables = useTables()
	const {
		showCallout,
		toggleShowCallout,
		selectedColumn,
		setSelectedColumn,
		onAdd,
	} = useAddVariable()
	const {
		onChangeSteps,
		steps,
		commandBar,
		elements,
		completedElements,
		allElements,
		isElementComplete,
		onResetVariable,
	} = useBusinessLogic(toggleShowCallout, setSelectedColumn)

	return (
		<Container>
			<BaseCallout
				id={selectedColumn}
				show={showCallout}
				toggleShow={toggleShowCallout}
				title="Assign new variable"
			>
				<AddVariableFields onAdd={onAdd} columnName={selectedColumn} />
			</BaseCallout>
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
	height: 100%;
	margin-top: 0.5rem;
	position: relative;
	overflow-y: auto;

	> div {
		padding: 0;
	}
`
