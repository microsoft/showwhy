/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, DefaultButton, TextField } from '@fluentui/react'
import type { Definition, DefinitionType, Handler1 } from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { useHandleKeyPress, useHandleOnBlur } from '~hooks'

export const AlternativeDefinitionsForm: FC<{
	onAdd: Handler1<Definition>
	definitionType: DefinitionType
	shouldHavePrimary: boolean
}> = memo(function AlternativeDefinitionsForm({
	onAdd,
	definitionType,
	shouldHavePrimary,
}) {
	const [isPrimary, setIsPrimary] = useState(shouldHavePrimary)
	const [label, setLabel] = useState('')
	const [description, setDescription] = useState('')

	const add = useCallback(() => {
		onAdd({
			variable: label,
			description,
			type: definitionType,
			level: isPrimary ? CausalityLevel.Primary : CausalityLevel.Secondary,
		} as Definition)
		setLabel('')
		setDescription('')
		setIsPrimary(false)
	}, [
		onAdd,
		label,
		description,
		setDescription,
		setLabel,
		isPrimary,
		definitionType,
	])
	const handler = useHandleKeyPress(add, 'enter')
	const handleOnBlur = useHandleOnBlur(add, [
		'definitions-form-variable-description',
		'definitions-form-variable-name',
	])

	return (
		<Container data-pw="definitions-form">
			<CheckboxContainer data-pw="definitions-form-is-primary">
				<Checkbox
					label="Is primary?"
					checked={isPrimary}
					onChange={(_, value) => setIsPrimary(value ?? false)}
				/>
			</CheckboxContainer>
			<Field
				onChange={(_, value) => setLabel(value ?? '')}
				value={label}
				placeholder="Enter label"
				data-pw="definitions-form-variable-name"
				onKeyPress={label ? handler : undefined}
				onBlur={label ? handleOnBlur : undefined}
			/>
			<Field
				onChange={(_, value) => setDescription(value ?? '')}
				value={description}
				multiline={(description?.length || 0) > 70}
				resizable={false}
				placeholder="Enter description"
				data-pw="definitions-form-variable-description"
				onKeyPress={label ? handler : undefined}
				onBlur={label ? handleOnBlur : undefined}
			/>
			<ButtonContainer>
				<DefaultButton
					disabled={!label?.length}
					onClick={add}
					data-pw="definitions-form-add-button"
				>
					Add
				</DefaultButton>
			</ButtonContainer>
		</Container>
	)
})

const CheckboxContainer = styled.div``

const Container = styled.form`
	display: grid;
	grid-template-columns: 15% 35% 40% 10%;
	align-items: center;
	padding: 0.5rem 0.2rem;
	border-radius: 0 0 3px 3px;
	background-color: #f1f1f1;
	margin-top: 0.1rem;
`

const Field = styled(TextField)`
	margin: 0;
	padding: 0 0.5rem;
`

const ButtonContainer = styled.div`
	text-align: center;
	padding-right: 8px;
`
