/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	Checkbox,
	DefaultButton,
	IComboBoxOption,
	TextField,
} from '@fluentui/react'
import {
	Handler,
	Setter,
	OptionalId,
	Experiment,
	CausalFactor,
	CausalityLevel,
} from '@showwhy/types'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { PageType } from '~types'
import { noop } from '~utils'
import { useMemo } from 'react'
import styled from 'styled-components'
import { VariablePicker } from '~components/VariablePicker'

type OnAddHandler = (factor: OptionalId<CausalFactor>) => void
type OnChangeHandler = (f: Partial<CausalFactor>) => void

export function useFactorsDefinitionForm({
	experiment,
	factor,
	pageType,
	variables,
	onAdd = noop,
	onChange = noop,
}: {
	pageType: PageType
	variables?: IComboBoxOption[]
	experiment?: Experiment
	factor?: CausalFactor
	onAdd?: OnAddHandler
	onChange?: OnChangeHandler
}): {
	level: JSX.Element
	variable: JSX.Element
	description: JSX.Element
} {
	const [description, setDescription] = useState<string>('')
	const [variable, setVariable] = useState<string>('')
	const [isPrimary, setIsPrimary] = useState<boolean>(false)
	const hasLevel = useHasLevel(factor)
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
			const edited: Partial<CausalFactor> = { ...factor, variable, description }
			hasLevel &&
				(edited.level = isPrimary
					? CausalityLevel.Primary
					: CausalityLevel.Secondary)
			onChange(edited)
		},
		[variable, isPrimary, description, factor, hasLevel, onChange],
	)

	const checkbox = useCheckbox(isPrimary, setIsPrimary)
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
		const newFactor = {
			variable,
			description,
			level: isPrimary ? CausalityLevel.Primary : CausalityLevel.Secondary,
		}
		onAdd(newFactor)
		resetFields()
	}, [resetFields, variable, isPrimary, description, onAdd])
}

function useCheckbox(
	isPrimary: boolean,
	setIsPrimary: (value: boolean) => void,
): JSX.Element {
	return useMemo(() => {
		return (
			<Checkbox
				label="Is primary?"
				checked={isPrimary}
				onChange={(_, value) => setIsPrimary(value ?? false)}
			/>
		)
	}, [isPrimary, setIsPrimary])
}

function useVariablePicker(
	variable: string,
	setVariable: (v: string) => void,
	variables?: IComboBoxOption[],
): JSX.Element {
	return useMemo(() => {
		return (
			<VariablePicker
				variable={variable}
				onChange={setVariable}
				showLabel={false}
				variables={variables}
			/>
		)
	}, [variable, variables, setVariable])
}

function useDescriptionBox(
	description: string,
	setDescription: (value: string) => void,
	variable: string,
	add: Handler,
	factor?: CausalFactor,
): JSX.Element {
	return useMemo(() => {
		return (
			<DetailsContainer>
				<Field
					onChange={(_, value) => setDescription(value ?? '')}
					value={description}
					placeholder="Enter description"
					multiline={(description?.length || 0) > 70}
					resizable={false}
					data-pw="factors-form-description"
				/>
				{!factor ? (
					<ButtonContainer>
						<AddButton
							disabled={!variable?.length}
							onClick={add}
							data-pw="factors-form-add-button"
						>
							Add
						</AddButton>
					</ButtonContainer>
				) : null}
			</DetailsContainer>
		)
	}, [description, setDescription, variable, add, factor])
}

function useHasLevel(factor?: CausalFactor): boolean {
	return useMemo(() => !!factor?.hasOwnProperty('level'), [factor])
}

const DetailsContainer = styled.div`
	display: flex;
`

const Field = styled(TextField)`
	width: 100%;
	margin: 0px 8px;
`

const AddButton = styled(DefaultButton)``

const ButtonContainer = styled.div`
	text-align: end;
	padding-right: 8px;
`
