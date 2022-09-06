/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { PrepareDataFull } from '@datashaper/react'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { AddVariableFields } from './components/AddVariableFields'
import { CompletedElements } from './components/CompletedElements'
import { DataTypeWarningMessage } from './components/DataTypeWarningMessage'
import { useBusinessLogic } from './DeriveDataVariablesPage.hooks'
import { usePrepareData } from './hooks/usePrepareData'

export const DeriveDataVariablesPage: FC = memo(
	function DeriveDataVariablesPage() {
		const {
			tables,
			workflow,
			setWorkflow,
			selectedTableId,
			setSelectedTableId,
			outputs,
			setOutputs,
		} = usePrepareData()

		const {
			commandBar,
			completedElements,
			allElements,
			onResetVariable,
			subjectIdentifier,
			onSetSubjectIdentifier,
			onAssignAllSubjects,
		} = useBusinessLogic(
			workflow,
			setWorkflow,
			setSelectedTableId,
			selectedTableId,
		)

		return (
			<Container>
				<DataTypeWarningMessage />
				<AddVariableFields />
				{allElements.length ? (
					<CompletedElements
						onAssignAllSubjects={onAssignAllSubjects}
						completedElements={completedElements}
						allElements={allElements}
						onResetVariable={onResetVariable}
						subjectIdentifier={subjectIdentifier}
						onSetSubjectIdentifier={onSetSubjectIdentifier}
					/>
				) : null}
				<PrepareDataFull
					inputs={tables}
					derived={outputs}
					workflow={workflow}
					selectedTableId={selectedTableId}
					onSelectedTableIdChanged={setSelectedTableId}
					onUpdateOutput={setOutputs}
					outputHeaderCommandBar={[commandBar]}
					onUpdateWorkflow={setWorkflow}
				/>
			</Container>
		)
	},
)

const Container = styled.div`
	height: 99%;
	margin-top: 5px;
	position: relative;
	overflow-y: auto;

	> div {
		padding: 0;
	}
`
