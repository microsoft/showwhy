/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { FC, memo } from 'react'
import styled from 'styled-components'
import { RenameCalloutType } from '~types'

interface ModelVariableCommandsProps {
	selectedDefinition: string
	onCallout: (type?: RenameCalloutType) => void
	onDelete: () => void
}
export const ModelVariableCommands: FC<ModelVariableCommandsProps> = memo(
	function ModelVariableCommands({ selectedDefinition, onCallout, onDelete }) {
		return (
			<Buttons>
				<IconButton
					iconProps={{ iconName: 'Edit' }}
					disabled={!selectedDefinition}
					onClick={() => onCallout(RenameCalloutType.Edit)}
					title="Edit"
					ariaLabel="Edit Icon"
				/>
				<IconButton
					iconProps={{ iconName: 'DuplicateRow' }}
					disabled={!selectedDefinition}
					onClick={() => onCallout(RenameCalloutType.Duplicate)}
					id={RenameCalloutType.Duplicate}
					title="DuplicateRow"
					ariaLabel="DuplicateRow Icon"
				/>
				<IconButton
					iconProps={{ iconName: 'Delete' }}
					disabled={!selectedDefinition}
					onClick={onDelete}
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
