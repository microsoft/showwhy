/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ActionButtons } from '@showwhy/components'
import type { Definition, Handler, Handler1, Maybe } from '@showwhy/types'
import { useCallback, useMemo, useState } from 'react'

import { useFactorsDefinitionForm, useOnChange } from '~hooks'
import { getDefault } from '~utils'

export function useFactorItems(
	rows: Definition[],
	factorToEdit: Maybe<Definition>,
	onDelete?: Maybe<Handler1<Definition>>,
	onSave?: Maybe<Handler1<Definition>>,
	onEdit?: Maybe<Handler1<Definition>>,
	onCancel?: Maybe<Handler>,
): {
	items: Record<string, any>
} {
	const [edited, setEdited] = useState<Maybe<Definition>>()
	const onChange = useOnChange(setEdited, factorToEdit)
	const { level, description, variable } = useFactorsDefinitionForm({
		factor: factorToEdit,
		onChange,
	})
	const getEditableRow = useGetEditableRow(
		factorToEdit,
		level,
		description,
		variable,
		onSave,
		onCancel,
	)
	const items = useMemo(() => {
		return rows.map(item => {
			if (factorToEdit?.id === item.id) {
				return getEditableRow(edited)
			}
			return getDefault(item, onEdit, onDelete)
		})
	}, [rows, factorToEdit, edited, onDelete, onEdit, getEditableRow])

	return {
		items,
	}
}

function useGetEditableRow(
	factorToEdit: Maybe<Definition>,
	level: JSX.Element,
	description: JSX.Element,
	variable: JSX.Element,
	onSave?: Maybe<Handler1<Definition>>,
	onCancel?: Maybe<Handler>,
): (edited: Maybe<Definition>) => Record<string, any> {
	return useCallback(
		(edited: Maybe<Definition>) => {
			return {
				level,
				description,
				variable,
				actions: (
					<ActionButtons
						onCancel={onCancel}
						onSave={
							onSave && factorToEdit
								? () =>
										onSave({
											...factorToEdit,
											...edited,
										})
								: undefined
						}
						disableSave={!edited?.variable}
					/>
				),
			}
		},
		[factorToEdit, level, description, variable, onSave, onCancel],
	)
}
