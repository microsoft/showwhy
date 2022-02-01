/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import styled from 'styled-components'
import { IconButton } from '@fluentui/react'

interface ModelVariableCommandsProps {
	selectedDefinition: string
	editDefinition: () => void
}
export const ModelVariableCommands: FC<ModelVariableCommandsProps> = memo(
	function ModelVariableCommands({ selectedDefinition, editDefinition }) {
		return (
			<Buttons>
				<IconButton
					iconProps={{ iconName: 'Edit' }}
					disabled={!selectedDefinition}
					onClick={editDefinition}
					title="Edit"
					ariaLabel="Edit Icon"
				/>
				<IconButton
					iconProps={{ iconName: 'DuplicateRow' }}
					disabled={!selectedDefinition}
					title="DuplicateRow"
					ariaLabel="DuplicateRow Icon"
				/>
				<IconButton
					iconProps={{ iconName: 'Delete' }}
					disabled={!selectedDefinition}
					title="Delete"
					ariaLabel="Delete Icon"
				/>
			</Buttons>
		)
	},
)

const Buttons = styled.div`
	display: flex;
	flex: 2;
	justify-content: initial;
`
