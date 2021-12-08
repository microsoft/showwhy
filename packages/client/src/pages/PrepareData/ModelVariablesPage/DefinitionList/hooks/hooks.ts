/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from 'ahooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useItem } from './item'
import { useOnDelete } from './onDelete'
import { useOnDuplicate, useOnDuplicateCausalFactor } from './onDuplicate'
import { useOnSave, useOnSaveCausalFactor } from './onSave'
import {
	useAddOrEditFactor,
	useDeleteCausalFactor,
	useDuplicateColumn,
	useRemoveDefinition,
	useSaveDefinition,
} from '~hooks'
import { ElementDefinition, CausalFactor, Item } from '~interfaces'
import { useModelVariables, useSetModelVariables } from '~state'
import { GenericObject } from '~types'

export const useDefinitionList = (
	list: CausalFactor[] | ElementDefinition[],
	onClick: (option: CausalFactor | ElementDefinition) => void,
	type: string,
	tableId: string,
	onUpdate: (definition: string) => void,
): GenericObject => {
	const [
		isEditingLabel,
		{ toggle: toggleIsEditingLabel, setFalse: setFalseEditing },
	] = useBoolean(false)
	const [editingDefinition, setEditingDefinition] = useState<
		CausalFactor | ElementDefinition
	>()
	const [newLabel, setNewLabel] = useState<string>()
	const [itemList, setItemList] = useState<any[]>([])
	const saveDefinition = useSaveDefinition()
	const removeDefinition = useRemoveDefinition()
	const saveCausalFactor = useAddOrEditFactor()
	const deleteCausalFactor = useDeleteCausalFactor()
	const duplicateColumn = useDuplicateColumn(tableId)
	const modelVariables = useModelVariables(tableId)
	const setModelVariables = useSetModelVariables(tableId)
	const listEndRef = useRef<HTMLInputElement>(null)

	const editDefinition = useCallback(
		(val: CausalFactor | ElementDefinition) => {
			toggleIsEditingLabel()
			setEditingDefinition(val)
			setNewLabel(val.variable)
		},
		[setNewLabel, setEditingDefinition, toggleIsEditingLabel],
	)

	const cancelField = useCallback(() => {
		setFalseEditing()
		setEditingDefinition(undefined)
		setNewLabel('')
	}, [setFalseEditing, setEditingDefinition, setNewLabel])

	const onSaveCausalFactor = useOnSaveCausalFactor({
		setNewLabel,
		newLabel,
		setEditingDefinition,
		toggleIsEditingLabel,
		saveCausalFactor,
	})

	const onSave = useOnSave({
		type,
		setNewLabel,
		newLabel,
		modelVariables,
		setEditingDefinition,
		toggleIsEditingLabel,
		saveDefinition,
		onUpdate,
		onSaveCausalFactor,
		setModelVariables,
	})

	const onDelete = useOnDelete({
		modelVariables,
		type,
		setModelVariables,
		removeDefinition,
		deleteCausalFactor,
	})

	const onDuplicateCausalFactor = useOnDuplicateCausalFactor({
		saveCausalFactor,
		listEndRef,
		onClick,
	})

	const onDuplicate = useOnDuplicate({
		saveDefinition,
		duplicateColumn,
		modelVariables,
		type,
		setModelVariables,
		onDuplicateCausalFactor,
		listEndRef,
		onClick,
	})

	const item = useItem({
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
	})

	useEffect(() => {
		const items: Item[] = list.map((x, index) =>
			item(x, index, list.length - 1),
		)
		setItemList(items)
	}, [item, list, setItemList])

	return {
		itemList,
	}
}
