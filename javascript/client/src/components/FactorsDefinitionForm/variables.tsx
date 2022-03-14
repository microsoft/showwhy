/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, DefaultButton, TextField } from '@fluentui/react'
import type { CausalFactor, Handler } from '@showwhy/types'
import { useMemo } from 'react'
import styled from 'styled-components'

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
	setVariable: (v: string) => void,
): JSX.Element {
	return useMemo(() => {
		return (
			<VariableField
				onChange={(_, value) => setVariable(value ?? '')}
				value={variable}
				placeholder="Type a variable"
				data-pw="factors-form-variable-name"
			/>
		)
	}, [variable, setVariable])
}

export function useDescriptionBox(
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
const VariableField = styled(TextField)`
	margin: 0px 8px;
`

const AddButton = styled(DefaultButton)``

const ButtonContainer = styled.div`
	text-align: end;
	padding-right: 8px;
`
