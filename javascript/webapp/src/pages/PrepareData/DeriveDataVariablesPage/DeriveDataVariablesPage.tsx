/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { AddVariableFields } from './components/AddVariableFields'
import { CompletedElements } from './components/CompletedElements'
import { DataTypeWarningMessage } from './components/DataTypeWarningMessage'
import { PrepareData } from './components/PrepareData'
import { useBusinessLogic } from './DeriveDataVariablesPage.hooks'

export const DeriveDataVariablesPage: FC = memo(
	function DeriveDataVariablesPage() {
		const {
			commandBar,
			completedElements,
			allElements,
			onResetVariable,
			subjectIdentifier,
			onSetSubjectIdentifier,
		} = useBusinessLogic()

		return (
			<Container>
				<DataTypeWarningMessage />
				<AddVariableFields />
				{allElements.length ? (
					<CompletedElements
						completedElements={completedElements}
						allElements={allElements}
						onResetVariable={onResetVariable}
						subjectIdentifier={subjectIdentifier}
						onSetSubjectIdentifier={onSetSubjectIdentifier}
					/>
				) : null}
				<PrepareData commandBar={commandBar} />
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
