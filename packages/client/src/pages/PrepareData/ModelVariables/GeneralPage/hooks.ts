/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 } from 'uuid'
import { usePageType, useRemoveDefinition, useSaveDefinition } from '~hooks'
import { useDefineQuestion } from '~state'
import {
	CausalFactor,
	CausalityLevel,
	Element,
	ElementDefinition,
	PageType,
} from '~types'

export function useBusinessLogic(): {
	pageType: PageType
	defineQuestionData: Element
	definitions: ElementDefinition[]
} {
	const pageType = usePageType()
	const defineQuestion = useDefineQuestion()
	const defineQuestionData = defineQuestion[pageType] as Element

	const definitions = useMemo((): ElementDefinition[] => {
		return defineQuestionData?.definition || []
	}, [defineQuestionData])

	return {
		pageType,
		defineQuestionData,
		definitions,
	}
}

export function useSelectedDefinition(
	definitionId: string,
	defineQuestionData: Element,
): ElementDefinition | undefined {
	return useMemo(() => {
		return defineQuestionData?.definition.find(x => x.id === definitionId)
	}, [definitionId, defineQuestionData])
}

export function useDefinitions(defineQuestionData: Element): {
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
	saveDefinition: (newDefinition: CausalFactor) => void //??
} {
	const [selectedDefinitionId, setSelectedDefinitionId] = useState<string>('')
	const [isEditingDefinition, setIsEditingDefinition] = useState<boolean>(false)
	const [isAddingDefinition, setIsAddingDefinition] = useState<boolean>(false)
	const [isDuplicatingDefinition, setIsDuplicatingDefinition] =
		useState<boolean>(false)
	const [definitionName, setDefinitionName] = useState<string>('')
	const saveDefinition = useSaveDefinition()
	const removeDefinition = useRemoveDefinition()
	const definition = useSelectedDefinition(
		selectedDefinitionId,
		defineQuestionData,
	)

	useEffect(() => {
		if (!definition && defineQuestionData) {
			setSelectedDefinitionId(defineQuestionData?.definition[0]?.id || '')
		}
	}, [
		definition,
		selectedDefinitionId,
		setSelectedDefinitionId,
		defineQuestionData,
	])

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
		definition && removeDefinition(definition)
	}, [definition, removeDefinition])

	const onSave = useCallback(
		(name?: string) => {
			const newId = v4()
			const props = isAddingDefinition
				? { id: newId, description: '', level: CausalityLevel.Secondary }
				: isDuplicatingDefinition
				? { ...definition, id: newId, level: CausalityLevel.Secondary }
				: definition
			const newDefinition = {
				...props,
				variable: name,
			} as ElementDefinition
			saveDefinition(newDefinition)

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
			saveDefinition,
			setIsEditingDefinition,
			setIsAddingDefinition,
			isAddingDefinition,
			definition,
			setSelectedDefinitionId,
			isDuplicatingDefinition,
			setIsDuplicatingDefinition,
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
		saveDefinition,
	}
}

export function useSetTargetVariable(
	selectedDefinitionId: string,
	saveDefinition: (definition: ElementDefinition) => void,
	defineQuestionData: Element,
): (column: string) => void {
	return useCallback(
		(column: string) => {
			const newDefinition = {
				...defineQuestionData?.definition.find(
					x => x.id === selectedDefinitionId,
				),
			} as ElementDefinition

			if (newDefinition) {
				newDefinition.column =
					newDefinition.column === column ? undefined : column
			}

			saveDefinition(newDefinition)
		},
		[selectedDefinitionId, saveDefinition, defineQuestionData?.definition],
	)
}
