/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Checkbox } from '@fluentui/react'
import type {
	DefinitionType,
	ElementDefinition,
	Handler,
	Handler1,
	Maybe,
	Setter,
} from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'
import { useCallback, useMemo, useState } from 'react'

import { useFactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import type { HeaderData, PageType } from '~types'

const actionsHeader: HeaderData = {
	fieldName: 'actions',
	value: 'Actions',
	width: '15%',
}

export function useTableComponent(
	columns: ElementDefinition[],
	headers: HeaderData[],
	definitionToEdit: Maybe<ElementDefinition>,
	factorToEdit: Maybe<ElementDefinition>,
	type: PageType | DefinitionType,
	onDelete?: Maybe<Handler1<ElementDefinition>>,
	onSave?: Maybe<Handler1<ElementDefinition>>,
	onEdit?: Maybe<Handler1<ElementDefinition>>,
	onCancel?: Maybe<Handler>,
): {
	items: any
	headersData: any[]
	customColumnsWidth: { fieldName: string; width: string }[]
} {
	const [editedDefinition, setEditedDefinition] =
		useState<Maybe<ElementDefinition>>()
	const [editedFactor, setEditedFactor] = useState<Maybe<ElementDefinition>>()
	const setter = definitionToEdit ? setEditedDefinition : setEditedFactor
	const onChange = useOnChange(setter, definitionToEdit || factorToEdit)
	const { level, description, variable, definitionType } = useFactorsDefinitionForm({
		factor: (definitionToEdit || factorToEdit) as ElementDefinition,
		onChange,
		type,
	})
	const headersData = useHeadersData(
		headers,
		Boolean(onDelete || onEdit || onCancel || onSave),
	)
	const customColumnsWidth = useCustomColumnsWidth(headersData)

	const items = useMemo(() => {
		return columns.map(item => {
			const copy = { ...item, id: undefined }
			delete copy.id
			const props = Object.keys(copy)
			let obj: any = {}
			if (definitionToEdit?.id === item.id) {
				obj = {
					level,
					type: definitionType,
					description,
					variable,
					actions: {
						onCancel: onCancel || null,
						onSave:
							onSave && definitionToEdit && editedDefinition
								? () =>
										onSave({
											...definitionToEdit,
											...editedDefinition,
										} as ElementDefinition)
								: null,
						disableSave: !editedDefinition?.variable,
					},
				}
			} else if (factorToEdit?.id === item.id) {
				obj = {
					description,
					variable,
					actions: {
						onCancel: onCancel || null,
						onSave:
							onSave && factorToEdit
								? () => onSave({ ...factorToEdit, ...editedFactor })
								: null,
						disableSave: !editedFactor?.variable,
					},
				}
			} else {
				props.forEach(prop => {
					obj[prop] =
						typeof (item as any)[prop] === 'boolean' ? (
							<Checkbox checked={(item as any)[prop]} />
						) : (
							(item as any)[prop]
						)
				})
				obj.actions = {
					onDelete: onDelete ? () => onDelete(item) : null,
					onEdit: onEdit ? () => onEdit(item) : null,
				}
			}
			return obj
		})
	}, [
		columns,
		definitionToEdit,
		factorToEdit,
		editedDefinition,
		editedFactor,
		description,
		level,
		onCancel,
		onDelete,
		onEdit,
		onSave,
		variable,
	])

	return {
		items,
		headersData,
		customColumnsWidth,
	}
}

function useOnChange(
	set: Setter<Maybe<ElementDefinition>>,
	valueToEdit: Maybe<{ id: string }>,
) {
	return useCallback(
		(value: Partial<ElementDefinition>) => {
			set({
				...value,
				description: value.description ?? '',
				variable: value?.variable ?? '',
				level: value?.level ?? CausalityLevel.Primary,
				id: valueToEdit?.id || '',
			})
		},
		[set, valueToEdit],
	)
}

function useHeadersData(
	headers: HeaderData[],
	hasHandlers: boolean,
): HeaderData[] {
	return useMemo(() => {
		return hasHandlers ? [...headers, actionsHeader] : headers
	}, [headers, hasHandlers])
}

function useCustomColumnsWidth(headersData: HeaderData[]) {
	return useMemo(() => {
		const props = headersData.map(h => h.fieldName)
		const hasLevel = props.includes('level')
		const colWidth = [
			{ fieldName: 'variable', width: `${hasLevel ? '25' : '30'}%` },
			{ fieldName: 'type', width: '13%' },
			{ fieldName: 'description', width: `${hasLevel ? '40' : '60'}%` },
			{ fieldName: 'actions', width: '10%' },
		]
		if (hasLevel) {
			colWidth.push({ fieldName: 'level', width: '12%' })
		}
		return colWidth
	}, [headersData])
}
