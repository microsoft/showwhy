/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Checkbox, DefaultButton, Dropdown, TextField } from '@fluentui/react'
import type {
	CausalFactor,
	ElementDefinition,
	Handler,
	Maybe,
} from '@showwhy/types'
import { DefinitionType } from '@showwhy/types'
import { useMemo } from 'react'
import styled from 'styled-components'

function handleKeyPress(fn: Handler) {
	return (event: React.KeyboardEvent<HTMLInputElement>) => {
		const enter = 'enter'
		if (
			event.code.toLowerCase() === enter ||
			event.key.toLowerCase() === enter ||
			event.keyCode === 13
		) {
			fn()
		}
	}
}

export function useCheckbox(
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

export function useVariableField(
	variable: string,
	add: Handler,
	setVariable: (v: string) => void,
	factor?: CausalFactor,
): JSX.Element {
	return useMemo(() => {
		const handler = handleKeyPress(add)
		return (
			<VariableField
				onChange={(_, value) => setVariable(value ?? '')}
				value={variable}
				placeholder="Type a variable"
				data-pw="factors-form-variable-name"
				onKeyPress={!factor ? handler : undefined}
			/>
		)
	}, [variable, setVariable, add, factor])
}

export function useDescriptionBox(
	description: string,
	setDescription: (value: string) => void,
	variable: string,
	add: Handler,
	factor?: CausalFactor,
): JSX.Element {
	return useMemo(() => {
		const handler = handleKeyPress(add)
		return (
			<DetailsContainer>
				<Field
					onChange={(_, value) => setDescription(value ?? '')}
					value={description}
					placeholder="Enter description"
					multiline={(description?.length || 0) > 70}
					resizable={false}
					data-pw="factors-form-description"
					onKeyPress={!factor ? handler : undefined}
				/>
			</DetailsContainer>
		)
	}, [description, setDescription, variable, add, factor])
}

export function useAddButton(
	add: Handler,
	variable: string,
	factor?: CausalFactor,
): JSX.Element | null {
	return (
		!factor ? (
			<ButtonContainer>
				<AddButton
					disabled={!variable?.length}
					onClick={add}
					data-pw="factors-form-add-button"
				>
					Add
				</AddButton>
			</ButtonContainer>
		) : null
	)
}

export function useDefinitionTypeDropdown(
	definitionType?: Maybe<DefinitionType>,
	onChange?: (item: DefinitionType) => void,
): JSX.Element {
	const options: IDropdownOption[] = [
		{ key: DefinitionType.Population, text: 'Population' },
		{ key: DefinitionType.Exposure, text: 'Exposure' },
		{ key: DefinitionType.Outcome, text: 'Outcome' },
	]

	return (
		<DropdownWrapper>
			<Dropdown
				selectedKey={definitionType || undefined}
				// eslint-disable-next-line react/jsx-no-bind
				onChange={
					onChange ? (e, i) => onChange(i?.key as DefinitionType) : undefined
				}
				placeholder="Select a type"
				options={options}
			/>
		</DropdownWrapper>
	)
}

export function useHasLevel(
	factor?: CausalFactor | ElementDefinition,
): boolean {
	return useMemo(() => !!factor?.hasOwnProperty('level'), [factor])
}

const DetailsContainer = styled.div``

const Field = styled(TextField)`
	width: 100%;
	margin: 0;
	padding: 0 0.5rem;
`
const VariableField = styled(TextField)`
	margin: 0;
	padding: 0 0.5rem;
`

const AddButton = styled(DefaultButton)``

const ButtonContainer = styled.div`
	text-align: center;
	padding-right: 8px;
`

const DropdownWrapper = styled.div`
	padding: 0 0.5rem
`