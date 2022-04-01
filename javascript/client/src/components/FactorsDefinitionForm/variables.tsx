/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Checkbox,
	DefaultButton,
	TextField,
	Dropdown,
	IDropdownOption,
} from '@fluentui/react'
import type { CausalFactor, ElementDefinition, Handler } from '@showwhy/types'
import { useMemo } from 'react'
import styled from 'styled-components'
import { PageType } from '../../types'

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
				onBlur={!factor ? () => add() : undefined}
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
					onBlur={!factor ? () => add() : undefined}
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

export function useHasLevel(
	factor?: CausalFactor | ElementDefinition,
): boolean {
	return useMemo(() => !!factor?.hasOwnProperty('level'), [factor])
}

export function useDefinitionTypeDropdown(
	definitionType: string,
	onChange: (item: string) => void,
): JSX.Element {
	const options: IDropdownOption[] = [
		{ key: 'population', text: 'Population' },
		{ key: 'exposure', text: 'Exposure' },
		{ key: 'outcome', text: 'Outcome' },
	]
	return (
		<Dropdown
			selectedKey={definitionType || undefined}
			// eslint-disable-next-line react/jsx-no-bind
			onChange={(e, i) => onChange(i?.key as string)}
			placeholder="Select a definition type"
			options={options}
		/>
	)
}

const DetailsContainer = styled.div`
	display: grid;
	grid-template-columns: 85% 15%;
	justify-content: center;
	gap: 1rem;
	padding: 0 0.5rem;
`

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
