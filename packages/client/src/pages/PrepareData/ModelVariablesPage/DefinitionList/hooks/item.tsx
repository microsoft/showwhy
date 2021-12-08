/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { TextField } from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'
import { InputRef } from './types'
import { CausalFactor, ElementDefinition, Item } from '~interfaces'
import { Text } from '~styles'
import { TypedFn, GenericFn, StringSetter } from '~types'

interface ItemArgs {
	isEditingLabel: boolean
	editingDefinition: CausalFactor | ElementDefinition | undefined
	listEndRef: InputRef
	newLabel: string | undefined
	onSave: GenericFn
	onClick: GenericFn
	onDelete: GenericFn
	cancelField: GenericFn
	onDuplicate: GenericFn
	editDefinition: GenericFn
	setNewLabel: StringSetter
}

export const useItem = ({
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
}: ItemArgs): TypedFn<Item> => {
	return useCallback(
		(x, index, len) => {
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
