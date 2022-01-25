/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// const checkbox = useCheckbox(isPrimary, setIsPrimary)
// const variablePicker = useVariablePicker(variable, setVariable, variables)
// const descriptionBox = useDescriptionBox(description, setDescription, variable, add, factor)
import {
	Checkbox,
	DefaultButton,
	IComboBoxOption,
	TextField,
} from '@fluentui/react'
import { useMemo } from 'react'
import styled from 'styled-components'
import { VariablePicker } from '~components/VariablePicker'
import { CausalFactor } from '~types'

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

export function useVariablePicker(
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

export function useDescriptionBox(
	description: string,
	setDescription: (value: string) => void,
	variable: string,
	add: () => void,
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
				/>
				{!factor ? (
					<ButtonContainer>
						<AddButton disabled={!variable?.length} onClick={add}>
							Add
						</AddButton>
					</ButtonContainer>
				) : null}
			</DetailsContainer>
		)
	}, [description, setDescription, variable, add, factor])
}

export function useHasLevel(factor?: CausalFactor): boolean {
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
