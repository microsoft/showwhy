/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Checkbox, IComboBoxOption } from '@fluentui/react'
import { useCallback, useMemo, useState } from 'react'
import { useFactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import {
	PageType,
	CausalFactor,
	ElementDefinition,
	HeaderData,
	Setter,
	CausalityLevel,
} from '~types'

const actionsHeader: HeaderData = { fieldName: 'actions', value: 'Actions' }

export function useTableComponent(
	columns: CausalFactor[],
	headers: HeaderData[],
	definitionToEdit: ElementDefinition | undefined,
	factorToEdit: CausalFactor | undefined,
	pageType: PageType,
	variables: IComboBoxOption[] | undefined,
	onDelete: undefined | ((def: CausalFactor) => void),
	onSave: undefined | ((def: CausalFactor) => void),
	onEdit: undefined | ((def: CausalFactor) => void),
	onCancel: undefined | ((def: CausalFactor) => void),
): {
	items: any
	headersData: any[]
	customColumnsWidth: { fieldName: string; width: string }[]
} {
	const [editedDefinition, setEditedDefinition] = useState<
		ElementDefinition | undefined
	>()
	const [editedFactor, setEditedFactor] = useState<CausalFactor | undefined>()
	const setter = definitionToEdit ? setEditedDefinition : setEditedFactor
	const onChange = useOnChange(setter, definitionToEdit || factorToEdit)
	const { level, description, variable } = useFactorsDefinitionForm({
		factor: (definitionToEdit || factorToEdit) as CausalFactor,
		onChange,
		pageType,
		variables,
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
										} as CausalFactor)
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
	set: Setter<CausalFactor | undefined>,
	valueToEdit: { id: string } | undefined,
) {
	return useCallback(
		(value: Partial<CausalFactor>) => {
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
			{ fieldName: 'description', width: `${hasLevel ? '50' : '60'}%` },
			{ fieldName: 'actions', width: '10%' },
		]
		if (hasLevel) {
			colWidth.push({ fieldName: 'level', width: '15%' })
		}
		return colWidth
	}, [headersData])
}
