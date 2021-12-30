/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Checkbox } from '@fluentui/react'
import { useCallback, useMemo, useState } from 'react'
import { useFactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import { CausalFactor, ElementDefinition } from '~interfaces'

const actionsHeader = { fieldName: 'actions', value: 'Actions' }

export const useTableComponent = (
	columns,
	headers,
	definitionToEdit,
	factorToEdit,
	pageType,
	variables,
	onDelete,
	onSave,
	onEdit,
	onCancel,
): {
	items: any
	headersData: any[]
	customColumnsWidth: { fieldName: string; width: string }[]
} => {
	const [editedDefinition, setEditedDefinition] = useState<
		ElementDefinition | undefined
	>()
	const [editedFactor, setEditedFactor] = useState<CausalFactor | undefined>()
	const setter = definitionToEdit ? setEditedDefinition : setEditedFactor
	const onChange = useOnchange(setter, definitionToEdit || factorToEdit)
	const { level, description, variable } = useFactorsDefinitionForm({
		factor: definitionToEdit || factorToEdit,
		onChange,
		pageType,
		variables,
	})
	const headersData = useHeadersData(
		headers,
		onDelete,
		onEdit,
		onCancel,
		onSave,
	)
	const customColumnsWidth = useCustomColumnsWidth(headersData)

	const items = useMemo(() => {
		return columns.map(item => {
			const copy = { ...item }
			delete copy.id
			const props = Object.keys(copy)
			let obj: any = {}
			if (definitionToEdit?.id === item.id) {
				obj = {
					level,
					description,
					variable,
					actions: {
						onCancel: onCancel || null,
						onSave:
							onSave && definitionToEdit && editedDefinition
								? () => onSave({ ...definitionToEdit, ...editedDefinition })
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
						typeof item[prop] === 'boolean' ? (
							<Checkbox checked={item[prop]} />
						) : (
							item[prop]
						)
				})
				obj.actions = {
					onDelete: onDelete ? () => onDelete(item) : null,
					onEdit: onEdit ? () => onEdit(item) : null,
				}
			}
			return obj
		})
	}, [columns, definitionToEdit, factorToEdit, editedDefinition, editedFactor])

	return {
		items,
		headersData,
		customColumnsWidth,
	}
}

const useOnchange = (set, valueToEdit) => {
	return useCallback(
		(value: ElementDefinition | CausalFactor) => {
			set({
				...value,
				id: valueToEdit?.id || '',
			})
		},
		[set, valueToEdit],
	)
}

const useHeadersData = (headers, onDelete, onEdit, onCancel, onSave) => {
	return useMemo(() => {
		return [
			...headers,
			(onDelete || onEdit || onCancel || onSave) && actionsHeader,
		]
	}, [headers, onDelete, onEdit, onCancel, onSave])
}

const useCustomColumnsWidth = headersData => {
	return useMemo(() => {
		const props = headersData.map(h => h.fieldName)
		const hasLevel = props.includes('level')
		const colWidth = [
			{ fieldName: 'variable', width: `${hasLevel ? '25' : '30'}%` },
			{ fieldName: 'description', width: `${hasLevel ? '50' : '60'}%` },
			{ fieldName: 'actions', width: '10%' },
		]
		if (hasLevel) {
			colWidth.push({ fieldName: 'level', width: '15%' })
		}
		return colWidth
	}, [headersData])
}
