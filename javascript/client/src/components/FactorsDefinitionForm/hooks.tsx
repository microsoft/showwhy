/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	ElementDefinition,
	Experiment,
	Handler,
	OptionalId,
	Setter,
} from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import type { PageType } from '~types'
import { noop } from '~utils'

import {
	useCheckbox,
	useDefinitionTypeDropdown,
	useDescriptionBox,
	useHasLevel,
	useVariableField,
} from './variables'

type OnAddHandler = (
	factor: OptionalId<CausalFactor | ElementDefinition>,
) => void
type OnChangeHandler = (f: Partial<CausalFactor | ElementDefinition>) => void

export function useFactorsDefinitionForm({
	experiment,
	factor,
	pageType,
	showLevel,
	onAdd = noop,
	onChange = noop,
	onDefinitionTypeChange = noop,
}: {
	pageType: PageType
	experiment?: Experiment
	factor?: CausalFactor | ElementDefinition
	showLevel?: boolean
	onAdd?: OnAddHandler
	onChange?: OnChangeHandler
	onDefinitionTypeChange?: (type: string) => void
}): {
	level: JSX.Element
	variable: JSX.Element
	description: JSX.Element
	definitionType: JSX.Element
} {
	const [description, setDescription] = useState<string>('')
	const [variable, setVariable] = useState<string>('')
	const [isPrimary, setIsPrimary] = useState<boolean>(false)
	const hasLevel = useHasLevel(factor) || showLevel
	const location = useLocation()

	const resetFields = useResetFields(setDescription, setVariable, setIsPrimary)
	const add = useAdd(variable, description, isPrimary, onAdd, resetFields)

	useEffect(
		function resetFormOnExperimentChange() {
			resetFields()
			if (experiment) {
				setVariable((experiment as any)[pageType]?.variable ?? '')
				setIsPrimary(!(experiment as any)[pageType]?.definition?.length)
			}
		},
		[pageType, location, experiment, resetFields],
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
			}
			hasLevel &&
				(edited.level = isPrimary
					? CausalityLevel.Primary
					: CausalityLevel.Secondary)
			onChange(edited)
		},
		[variable, isPrimary, description, factor, hasLevel, onChange],
	)

	const checkbox = useCheckbox(isPrimary, setIsPrimary)
	const variableField = useVariableField(variable, add, setVariable, factor)
	const definitionTypeDropdown = useDefinitionTypeDropdown(
		pageType,
		onDefinitionTypeChange,
	)
	const descriptionBox = useDescriptionBox(
		description,
		setDescription,
		variable,
		add,
		factor,
	)

	return {
		level: checkbox,
		variable: variableField,
		description: descriptionBox,
		definitionType: definitionTypeDropdown,
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
	onAdd: OnAddHandler,
	resetFields: Handler,
): Handler {
	return useCallback(() => {
		if (!variable) return
		const newFactor = {
			variable,
			description,
			level: isPrimary ? CausalityLevel.Primary : CausalityLevel.Secondary,
		}
		onAdd(newFactor)
		resetFields()
	}, [resetFields, variable, isPrimary, description, onAdd])
}
