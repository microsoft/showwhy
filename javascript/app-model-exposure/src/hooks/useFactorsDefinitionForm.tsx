/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import type { CausalFactor } from '../types/causality/CausalFactor.js'
import { CausalityLevel } from '../types/causality/CausalityLevel.js'
import type { Definition } from '../types/experiments/Definition.js'
import { DefinitionType } from '../types/experiments/DefinitionType.js'
import type { Handler, Maybe, OptionalId, Setter } from '../types/primitives.js'
import { getDefinitionsByType } from '../utils/definition.js'
import { noop } from '../utils/noop.js'
import {
	useAddButton,
	useCheckbox,
	useDescriptionBox,
	useHasLevel,
	useVariableField,
} from './variables.js'

type OnAddHandler = (factor: OptionalId<CausalFactor | Definition>) => void
type OnChangeHandler = (f: Partial<CausalFactor | Definition>) => void

export function useFactorsDefinitionForm({
	definitions,
	factor,
	showLevel,
	definitionType = DefinitionType.Population,
	onAdd = noop,
	onChange = noop,
}: {
	definitions?: Definition[]
	factor?: CausalFactor | Definition
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
			const edited: Partial<CausalFactor | Definition> = {
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
