/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, DefaultButton, TextField } from '@fluentui/react'
import type { CausalFactor, Definition, Handler } from '@showwhy/types'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useHandleKeyPress } from './useHandleKeyPress'
import { useHandleOnBlur } from './useHandleOnBlur'

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
	const handleOnBlur = useHandleOnBlur(add, [
		'factors-form-description',
		'factors-form-variable-name',
	])
	const handler = useHandleKeyPress(add)
	return useMemo(() => {
		return (
			<VariableField
				onChange={(_, value) => setVariable(value ?? '')}
				value={variable}
				placeholder="Enter label"
				data-pw="factors-form-variable-name"
				onKeyPress={!factor ? handler : undefined}
				onBlur={!factor ? handleOnBlur : undefined}
			/>
		)
	}, [variable, setVariable, factor, handleOnBlur, handler])
}

export function useDescriptionBox(
	description: string,
	setDescription: (value: string) => void,
	add: Handler,
	factor?: CausalFactor,
): JSX.Element {
	const handler = useHandleKeyPress(add)
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
					onKeyPress={!factor ? handler : undefined}
					onBlur={!factor ? () => add() : undefined}
				/>
			</DetailsContainer>
		)
	}, [description, setDescription, add, factor, handler])
}

export function useAddButton(
	add: Handler,
	variable: string,
	factor?: CausalFactor,
): JSX.Element | null {
	return !factor ? (
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
}

export function useHasLevel(factor?: CausalFactor | Definition): boolean {
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
