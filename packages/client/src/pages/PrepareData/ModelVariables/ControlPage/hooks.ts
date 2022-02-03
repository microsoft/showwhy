/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IDropdownOption } from '@fluentui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 } from 'uuid'
import { useAddOrEditFactor, useDeleteCausalFactor, usePageType } from '~hooks'
import { useCausalFactors } from '~state'
import { CausalFactor, PageType } from '~types'

export function useBusinessLogic(): {
	pageType: PageType
	definitions: CausalFactor[]
} {
	const pageType = usePageType()
	const definitions = useCausalFactors()

	return {
		pageType,
		definitions,
	}
}

export function useSelectedDefinition(
	definitionId: string,
	causalFactors: CausalFactor[],
): CausalFactor | undefined {
	return useMemo(() => {
		return causalFactors?.find(x => x.id === definitionId)
	}, [definitionId, causalFactors])
}

export function useDefinitionDropdown(
	definitionOptions: CausalFactor[],
): IDropdownOption[] {
	return useMemo((): IDropdownOption[] => {
		return definitionOptions.map(x => {
			return {
				key: x.id,
				text: x.variable,
			} as IDropdownOption
		})
	}, [definitionOptions])
}

export function useSetTargetVariable(
	selectedDefinitionId: string,
	causalFactors: CausalFactor[],
	saveCausalFactor: (causalFactor: CausalFactor) => void,
): (column: string) => void {
	return useCallback(
		(column: string) => {
			const selectedCausal = {
				...causalFactors.find(x => x.id === selectedDefinitionId),
			} as CausalFactor

			if (selectedCausal) {
				selectedCausal.column = column
			}

			saveCausalFactor(selectedCausal)
		},
		[selectedDefinitionId, causalFactors, saveCausalFactor],
	)
}

export function useDefinitions(causalFactors: CausalFactor[]): {
	selectedDefinitionId: string
	setSelectedDefinitionId: (definitionId: string) => void
	isEditingDefinition: boolean
	isAddingDefinition: boolean
	isDuplicatingDefinition: boolean
	toggleEditDefinition: () => void
	toggleAddDefinition: () => void
	toggleDuplicateDefinition: () => void
	onChange: (_: unknown, value?: string) => void
	definitionName: string
	onSave: (name?: string) => void
	onDelete: () => void
	saveCausalFactor: (factor) => void
} {
	const [selectedDefinitionId, setSelectedDefinitionId] = useState<string>('')
	const [isEditingDefinition, setIsEditingDefinition] = useState<boolean>(false)
	const [isAddingDefinition, setIsAddingDefinition] = useState<boolean>(false)
	const [isDuplicatingDefinition, setIsDuplicatingDefinition] =
		useState<boolean>(false)
	const [definitionName, setDefinitionName] = useState<string>('')
	const saveCausalFactor = useAddOrEditFactor()
	const deleteCausalFactor = useDeleteCausalFactor()
	const definition = useSelectedDefinition(selectedDefinitionId, causalFactors)

	useEffect(() => {
		if (!definition && causalFactors) {
			setSelectedDefinitionId(causalFactors[0]?.id || '')
		}
	}, [definition, setSelectedDefinitionId, causalFactors])

	const toggleEditDefinition = useCallback(() => {
		setIsEditingDefinition(prev => !prev)
		setDefinitionName(definition?.variable || '')
	}, [setIsEditingDefinition, definition, setDefinitionName])

	const toggleAddDefinition = useCallback(() => {
		setIsAddingDefinition(prev => !prev)
		setDefinitionName('New definition')
	}, [setDefinitionName, setIsAddingDefinition])

	const toggleDuplicateDefinition = useCallback(() => {
		setIsDuplicatingDefinition(prev => !prev)
		setDefinitionName(`${definition?.variable} new`)
	}, [setDefinitionName, setIsDuplicatingDefinition, definition])

	const onChange = useCallback(
		(_, value?: string) => {
			setDefinitionName(value || '')
		},
		[setDefinitionName],
	)

	const onDelete = useCallback(() => {
		definition && deleteCausalFactor(definition)
	}, [definition, deleteCausalFactor])

	const onSave = useCallback(
		(name?: string) => {
			const newId = v4()
			const props = isAddingDefinition
				? { id: newId, description: '' }
				: isDuplicatingDefinition
				? { ...definition, id: newId }
				: definition

			const newCausalFactor = {
				...props,
				variable: name,
			} as CausalFactor
			saveCausalFactor(newCausalFactor)

			setIsEditingDefinition(false)
			setIsAddingDefinition(false)
			setIsDuplicatingDefinition(false)

			setTimeout(() => {
				if (isAddingDefinition || isDuplicatingDefinition) {
					setSelectedDefinitionId(newId)
				}
			}, 300)
		},
		[
			setIsEditingDefinition,
			setIsAddingDefinition,
			isAddingDefinition,
			definition,
			setSelectedDefinitionId,
			isDuplicatingDefinition,
			setIsDuplicatingDefinition,
			saveCausalFactor,
		],
	)

	return {
		selectedDefinitionId,
		setSelectedDefinitionId,
		isEditingDefinition,
		isAddingDefinition,
		isDuplicatingDefinition,
		toggleEditDefinition,
		onChange,
		toggleAddDefinition,
		onSave,
		definitionName,
		onDelete,
		toggleDuplicateDefinition,
		saveCausalFactor,
	}
}
