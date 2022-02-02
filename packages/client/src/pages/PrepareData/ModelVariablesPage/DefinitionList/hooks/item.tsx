/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { TextField } from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'
import { InputRef } from './types'
import { Text } from '~styles'
import { CausalFactor, Item, Setter, Maybe } from '~types'

export function useItem({
	isEditingLabel,
	editingDefinition,
	listEndRef,
	newLabel,
	onSave,
	onClick,
	onDelete,
	cancelField,
	onDuplicate,
	editDefinition,
	setNewLabel,
}: {
	isEditingLabel: boolean
	editingDefinition?: CausalFactor
	listEndRef: InputRef
	newLabel?: string
	onSave: (f: CausalFactor) => void
	onClick: (f: CausalFactor) => void
	onDelete: (f: CausalFactor) => void
	cancelField: () => void
	onDuplicate: (f: CausalFactor) => void
	editDefinition: (f: CausalFactor) => void
	setNewLabel: Setter<Maybe<string>>
}): (x: CausalFactor, index: number, len: number) => Item {
	return useCallback(
		(x: CausalFactor, index: number, len: number) => {
			return {
				label:
					isEditingLabel && editingDefinition === x ? (
						<Input
							value={newLabel}
							onChange={(e, v) => setNewLabel(v || '')}
							onKeyPress={e => e.key === 'Enter' && onSave(x)}
						/>
					) : (
						<TextLabel>
							<Text>{x.variable}</Text>
							<DefinitionColumn>{x.column}</DefinitionColumn>
						</TextLabel>
					),
				actions:
					isEditingLabel && editingDefinition === x
						? {
								onSave: () => onSave(x),
								onCancel: cancelField,
								disableSave: !newLabel,
						  }
						: {
								onDelete: () => onDelete(x),
								onDuplicate: () => onDuplicate(x),
								onEdit: () => editDefinition(x),
						  },
				onClick: () => onClick(x),
				ref: index === len ? listEndRef : null,
			}
		},
		[
			isEditingLabel,
			editingDefinition,
			listEndRef,
			newLabel,
			onSave,
			onClick,
			onDelete,
			cancelField,
			onDuplicate,
			editDefinition,
			setNewLabel,
		],
	)
}

const Input = styled(TextField)`
	width: 100%;
	flex: 4;
	padding-left: 8px;
`

const TextLabel = styled.span`
	padding-left: 8px;
	display: flex;
	flex-direction: column;
	flex: 1;
	word-break: break-word;
`

const DefinitionColumn = styled.small`
	color: ${({ theme }) => theme.application().accent()};
`
