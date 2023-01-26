/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo, useState } from 'react'

import { ActionButtons } from '../components/ActionButtons.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { Handler, Handler1, Maybe } from '../types/primitives.js'
import { getDefault } from '../utils/tables.js'
import { useFactorsDefinitionForm } from './useFactorsDefinitionForm.js'
import { useOnChange } from './useOnChange.js'

export function useFactorItems(
	rows: Definition[],
	factorToEdit: Maybe<Definition>,
	onDelete?: Maybe<Handler1<Definition>>,
	onSave?: Maybe<Handler1<Definition>>,
	onEdit?: Maybe<Handler1<Definition>>,
	onCancel?: Maybe<Handler>,
	// eslint-disable-next-line
): Record<string, any> {
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
	return useMemo(() => {
		return rows.map((item) => {
			if (factorToEdit?.id === item.id) {
				return getEditableRow(edited)
			}
			return getDefault(item, onEdit, onDelete)
		})
	}, [rows, factorToEdit, edited, onDelete, onEdit, getEditableRow])
}

function useGetEditableRow(
	factorToEdit: Maybe<Definition>,
	level: JSX.Element,
	description: JSX.Element,
	variable: JSX.Element,
	onSave?: Maybe<Handler1<Definition>>,
	onCancel?: Maybe<Handler>,
	// eslint-disable-next-line
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
