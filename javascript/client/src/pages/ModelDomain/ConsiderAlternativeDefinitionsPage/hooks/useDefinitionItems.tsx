/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ActionButtons } from '@showwhy/components'
import type {
	DefinitionType,
	ElementDefinition,
	Handler,
	Handler1,
	Maybe,
} from '@showwhy/types'
import { useCallback, useMemo, useState } from 'react'

import { useFactorsDefinitionForm, useOnChange } from '~hooks'
import { getDefault } from '~utils'

export function useDefinitionItems(
	definitions: ElementDefinition[],
	definitionToEdit: Maybe<ElementDefinition>,
	definitionType: DefinitionType,
	onDelete?: Maybe<Handler1<ElementDefinition>>,
	onSave?: Maybe<Handler1<ElementDefinition>>,
	onEdit?: Maybe<Handler1<ElementDefinition>>,
	onCancel?: Maybe<Handler>,
): { items: Record<string, any>[] } {
	const [edited, setEdited] = useState<Maybe<ElementDefinition>>()
	const onChange = useOnChange(setEdited, definitionToEdit)
	const { level, description, variable } = useFactorsDefinitionForm({
		factor: definitionToEdit,
		onChange,
		definitionType,
	})

	const getEditableRow = useGetEditableRow(
		definitionToEdit,
		definitionType,
		level,
		description,
		variable,
		onSave,
		onCancel,
	)
	const items = useMemo(() => {
		return definitions.map(item => {
			if (item.id === definitionToEdit?.id) {
				return getEditableRow(edited)
			}
			return getDefault(item, onEdit, onDelete)
		})
	}, [getEditableRow, definitions, definitionToEdit, edited, onDelete, onEdit])

	return {
		items,
	}
}

function useGetEditableRow(
	definitionToEdit: Maybe<ElementDefinition>,
	type: DefinitionType,
	level: JSX.Element,
	description: JSX.Element,
	variable: JSX.Element,
	onSave?: Maybe<Handler1<ElementDefinition>>,
	onCancel?: Maybe<Handler>,
): (edited: Maybe<ElementDefinition>) => Record<string, any> {
	return useCallback(
		(edited: Maybe<ElementDefinition>) => {
			return {
				level,
				type,
				description,
				variable,
				actions: (
					<ActionButtons
						onCancel={onCancel}
						onSave={
							onSave && definitionToEdit && edited
								? () =>
										onSave({
											...definitionToEdit,
											...edited,
										} as ElementDefinition)
								: undefined
						}
						disableSave={!edited?.variable}
					/>
				),
			}
		},
		[definitionToEdit, type, level, description, variable, onSave, onCancel],
	)
}
