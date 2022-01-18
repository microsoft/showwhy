/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IComboBoxOption } from '@fluentui/react'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
	useCheckbox,
	useDescriptionBox,
	useHasLevel,
	useVariablePicker,
} from './variables'
import { DefinitionType, PageType } from '~enums'
import { DescribeElements, Factor } from '~interfaces'

export const useFactorsDefinitionForm = ({
	defineQuestion,
	factor,
	pageType,
	variables,
	onAdd,
	onChange,
}: {
	pageType: PageType
	variables?: IComboBoxOption[]
	onAdd?: (factor: Omit<Factor, 'id'>) => void
	defineQuestion?: DescribeElements
	factor?: Factor
	onChange?: (f: Partial<Factor>) => void
}): {
	level
	variable
	description
} => {
	const [description, setDescription] = useState<string>('')
	const [variable, setVariable] = useState<string>('')
	const [isPrimary, setIsPrimary] = useState<boolean | undefined>(false)
	const hasLevel = useHasLevel(factor)
	const location = useLocation()

	const resetFields = useCallback(() => {
		setDescription('')
		setVariable('')
		setIsPrimary(false)
	}, [setDescription, setIsPrimary])

	const add = useCallback(() => {
		const newFactor = {
			variable,
			description,
			level: isPrimary ? DefinitionType.Primary : DefinitionType.Secondary,
		}
		onAdd && onAdd(newFactor)
		resetFields()
	}, [resetFields, variable, isPrimary, description, onAdd])

	useEffect(() => {
		resetFields()
		defineQuestion && setVariable(defineQuestion[pageType]?.variable)
	}, [pageType, location, defineQuestion, resetFields])

	useEffect(() => {
		defineQuestion &&
			setIsPrimary(!defineQuestion[pageType]?.definition?.length)
	}, [defineQuestion, pageType])

	useEffect(() => {
		if (factor) {
			setVariable(factor.variable)
			setDescription(factor.description || '')
			hasLevel && setIsPrimary(factor.level === DefinitionType.Primary)
		}
	}, [factor, hasLevel])

	useEffect(() => {
		const edited: Partial<Factor> = { ...factor, variable, description }
		hasLevel &&
			(edited.level = isPrimary
				? DefinitionType.Primary
				: DefinitionType.Secondary)
		onChange && onChange(edited)
	}, [variable, isPrimary, description, factor, hasLevel, onChange])

	const checkbox = useCheckbox(!!isPrimary, setIsPrimary)
	const variablePicker = useVariablePicker(variable, setVariable, variables)
	const descriptionBox = useDescriptionBox(
		description,
		setDescription,
		variable,
		add,
		factor,
	)

	return {
		level: checkbox,
		variable: variablePicker,
		description: descriptionBox,
	}
}
