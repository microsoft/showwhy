/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	ElementDefinition,
	Handler,
	Maybe,
	OptionalId,
	Setter,
} from '@showwhy/types'
import { CausalityLevel, DefinitionType } from '@showwhy/types'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { getDefinitionsByType, noop } from '~utils'

import {
	useAddButton,
	useCheckbox,
	useDescriptionBox,
	useHasLevel,
	useVariableField,
} from './variables'

type OnAddHandler = (
	factor: OptionalId<CausalFactor | ElementDefinition>,
) => void
type OnChangeHandler = (f: Partial<CausalFactor | ElementDefinition>) => void

export function useFactorsDefinitionForm({
	definitions,
	factor,
	showLevel,
	definitionType = DefinitionType.Population,
	onAdd = noop,
	onChange = noop,
}: {
	definitions?: ElementDefinition[]
	factor?: CausalFactor | ElementDefinition
	showLevel?: boolean
	definitionType?: DefinitionType
	onAdd?: OnAddHandler
	onChange?: OnChangeHandler
}): {
	level: JSX.Element
	variable: JSX.Element
	description: JSX.Element
	addButton: JSX.Element | null
} {
	const [description, setDescription] = useState<string>('')
	const [variable, setVariable] = useState<string>('')
	const [isPrimary, setIsPrimary] = useState<boolean>(false)
	const hasLevel = useHasLevel(factor) || showLevel
	const location = useLocation()

	const resetFields = useResetFields(setDescription, setVariable, setIsPrimary)
	const add = useAdd(
		variable,
		description,
		isPrimary,
		definitionType,
		onAdd,
		resetFields,
	)

	useEffect(
		function resetFormOnExperimentChange() {
			resetFields()
			if (definitions?.length && definitionType) {
				setIsPrimary(!getDefinitionsByType(definitionType, definitions).length)
			}
		},
		[definitionType, location, definitions, resetFields],
	)

	useEffect(
		function syncSelectedFactorVariable() {
			if (factor) {
				setVariable(factor.variable)
				setDescription(factor.description || '')
				hasLevel && setIsPrimary(factor.level === CausalityLevel.Primary)
			}
		},
		[factor, hasLevel],
	)

	useEffect(
		function syncEditedFactor() {
			const edited: Partial<CausalFactor | ElementDefinition> = {
				...factor,
				variable,
				description,
				type: definitionType,
			}
			hasLevel &&
				(edited.level = isPrimary
					? CausalityLevel.Primary
					: CausalityLevel.Secondary)
			onChange(edited)
		},
		[
			variable,
			isPrimary,
			description,
			definitionType,
			factor,
			hasLevel,
			onChange,
		],
	)

	const checkbox = useCheckbox(isPrimary, setIsPrimary)
	const variableField = useVariableField(variable, add, setVariable, factor)
	const addButton = useAddButton(add, variable, factor)
	const descriptionBox = useDescriptionBox(
		description,
		setDescription,
		add,
		factor,
	)

	return {
		level: checkbox,
		variable: variableField,
		description: descriptionBox,
		addButton,
	}
}

function useResetFields(
	setDescription: Setter<string>,
	setVariable: Setter<string>,
	setIsPrimary: Setter<boolean>,
): Handler {
	return useCallback(() => {
		setDescription('')
		setVariable('')
		setIsPrimary(false)
	}, [setDescription, setIsPrimary, setVariable])
}

function useAdd(
	variable: string,
	description: string,
	isPrimary: boolean,
	type: Maybe<DefinitionType>,
	onAdd: OnAddHandler,
	resetFields: Handler,
): Handler {
	return useCallback(() => {
		if (!variable) return
		const newFactor = {
			variable,
			description,
			type,
			level: isPrimary ? CausalityLevel.Primary : CausalityLevel.Secondary,
		}
		onAdd(newFactor)
		resetFields()
	}, [resetFields, variable, isPrimary, description, onAdd, type])
}
