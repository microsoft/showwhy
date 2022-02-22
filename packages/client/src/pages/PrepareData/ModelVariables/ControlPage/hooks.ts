/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IDropdownOption } from '@fluentui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 } from 'uuid'
import { useAddOrEditFactor, useDeleteCausalFactor, usePageType } from '~hooks'
import { useCausalFactors } from '~state'
import {
	CausalFactor,
	DefinitionActions,
	DefinitionArgs,
	ElementDefinition,
	Handler,
	Handler1,
	Maybe,
	PageType,
	RenameCalloutType,
	VariableAssignedCount,
} from '~types'

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
	saveCausalFactor: (causalFactor: CausalFactor) => void,
	causalFactors: CausalFactor[],
): (column: string) => void {
	return useCallback(
		(column: string) => {
			const selectedCausal = {
				...causalFactors.find(x => x.id === selectedDefinitionId),
			} as CausalFactor

			if (selectedCausal) {
				selectedCausal.column =
					selectedCausal.column === column ? undefined : column
			}

			saveCausalFactor(selectedCausal)
		},
		[selectedDefinitionId, causalFactors, saveCausalFactor],
	)
}

export function useDefinitions(definitions: CausalFactor[]): DefinitionArgs {
	const [selectedId, setSelectedId] = useState<string>('')
	const definition = useMemo(() => {
		return definitions?.find(x => x.id === selectedId)
	}, [selectedId, definitions])

	useEffect(() => {
		if (!definition && definitions) {
			setSelectedId(definitions[0]?.id || '')
		}
	}, [definition, setSelectedId, definitions])

	const onSelect = useCallback(
		(id: string) => {
			setSelectedId(id)
		},
		[setSelectedId],
	)

	const assignedCount = useMemo((): Maybe<VariableAssignedCount> => {
		const total = definitions.length
		if (!total) return undefined
		const assigned = definitions.filter(x => x.column?.length).length

		return {
			total,
			assigned,
		}
	}, [definitions])

	return {
		definition,
		onSelect,
		assignedCount,
	}
}

export function useDefinitionActions(
	toggleCallout: Handler1<Maybe<RenameCalloutType>>,
	setSelectedId: Handler1<string>,
	toggleShowConfirmDelete: Handler,
	definition?: ElementDefinition | CausalFactor,
	calloutOpen?: RenameCalloutType,
): DefinitionActions {
	const onSave = useAddOrEditFactor()
	const deleteCausalFactor = useDeleteCausalFactor()

	const onDelete = useCallback(() => {
		definition && deleteCausalFactor(definition)
		toggleShowConfirmDelete()
	}, [definition, deleteCausalFactor, toggleShowConfirmDelete])

	const onSaveCallout = useCallback(
		(name?: string) => {
			const newId = v4()
			const props =
				calloutOpen === RenameCalloutType.New
					? { id: newId, description: '' }
					: calloutOpen === RenameCalloutType.Duplicate
					? { ...definition, id: newId }
					: definition

			const newCausalFactor = {
				...props,
				variable: name,
			} as CausalFactor

			onSave(newCausalFactor)
			toggleCallout(undefined)

			setTimeout(() => {
				setSelectedId(newCausalFactor.id)
			}, 300)
		},
		[definition, setSelectedId, onSave, toggleCallout, calloutOpen],
	)

	return {
		onDelete,
		onSave,
		onSaveCallout,
	}
}
