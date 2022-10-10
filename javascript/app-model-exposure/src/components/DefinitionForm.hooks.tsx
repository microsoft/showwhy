/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo, useState } from 'react'
import type { SetterOrUpdater } from 'recoil'

import { useFactorsDefinitionForm } from '../hooks/useFactorsDefinitionForm.js'
import { useOnChange } from '../hooks/useOnChange.js'
import { CausalityLevel } from '../types/causality/CausalityLevel.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { DefinitionType } from '../types/experiments/DefinitionType.js'
import type { Header } from '../types/Header.js'
import type { Handler, Handler1, Maybe } from '../types/primitives.js'
import { withRandomId } from '../utils/ids.js'
import { getDefault } from '../utils/tables.js'
import { ActionButtons } from './ActionButtons.js'
import { saveDefinitions, updateListTypes } from './DefinitionForm.utils.js'

export function useHeaders(width: number): Header[] {
	return useMemo(() => {
		return [
			{ fieldName: 'level', name: 'Level', width: width * 0.15 || 150 },
			{ fieldName: 'variable', name: 'Label', width: width * 0.35 || 350 },
			{
				fieldName: 'description',
				name: 'Description',
				width: width * 0.4 || 400,
			},
			{ fieldName: 'actions', name: 'Actions', width: width * 0.1 || 100 },
		]
	}, [width])
}

export function useDefinitionItems(
	definitions: Definition[],
	definitionToEdit: Maybe<Definition>,
	definitionType: DefinitionType,
	onDelete?: Maybe<(definition: Definition) => Promise<Definition[]>>,
	onSave?: Maybe<(definition: Definition) => Promise<Definition[]>>,
	onEdit?: Maybe<Handler1<Definition>>,
	onDismissEdit?: Maybe<Handler>,
	//eslint-disable-next-line
): { items: Record<string, any>[] } {
	const [edited, setEdited] = useState<Maybe<Definition>>()
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
		onDismissEdit,
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
	definitionToEdit: Maybe<Definition>,
	type: DefinitionType,
	level: JSX.Element,
	description: JSX.Element,
	variable: JSX.Element,
	onSave?: Maybe<Handler1<Definition>>,
	onDismissEdit?: Maybe<Handler>,
	//eslint-disable-next-line
): (edited: Maybe<Definition>) => Record<string, any> {
	return useCallback(
		(edited: Maybe<Definition>) => {
			return {
				level,
				type,
				description,
				variable,
				actions: (
					<ActionButtons
						onCancel={onDismissEdit}
						onSave={
							onSave && definitionToEdit && edited
								? () => {
										onSave({
											...definitionToEdit,
											...edited,
										} as Definition)
										onDismissEdit && onDismissEdit()
								  }
								: undefined
						}
						disableSave={!edited?.variable}
					/>
				),
			}
		},
		[
			definitionToEdit,
			type,
			level,
			description,
			variable,
			onSave,
			onDismissEdit,
		],
	)
}

export function useAddDefinition(
	definitions: Definition[],
	setDefinitions: SetterOrUpdater<Definition[]>,
): (definition: Definition) => void {
	return useCallback(
		(definition: Definition): void => {
			if (!definition.variable?.length) {
				return
			}
			definition = withRandomId(definition)
			let list = []
			if (definition.level === CausalityLevel.Primary) {
				list = [...updateListTypes(definitions, definition.type), definition]
			} else {
				list = [...definitions, definition]
			}
			saveDefinitions(list, definitions, setDefinitions).catch(e =>
				console.error('error saving definition change', e),
			)
		},
		[definitions, setDefinitions],
	)
}

export function useEditDefinition(
	definitions: Definition[],
	setDefinitions: SetterOrUpdater<Definition[]>,
): (definition: Definition) => Promise<Definition[]> {
	return useCallback(
		async (definition: Definition) => {
			let newDefinitions = updateListTypes(definitions, definition.type)
			newDefinitions = newDefinitions.map(d => {
				if (d.id === definition.id) {
					return { ...d, ...definition }
				}
				return d
			})
			await saveDefinitions(newDefinitions, definitions, setDefinitions)
			return newDefinitions
		},
		[definitions, setDefinitions],
	)
}

export function useRemoveDefinition(
	definitions: Definition[],
	setDefinitions: SetterOrUpdater<Definition[]>,
): (definition: Definition) => Promise<Definition[]> {
	return useCallback(
		async (definition: Definition) => {
			const newDefinitions =
				definitions?.filter(def => def.id !== definition.id) || []
			await saveDefinitions(newDefinitions, definitions, setDefinitions)
			return newDefinitions
		},
		[definitions, setDefinitions],
	)
}
