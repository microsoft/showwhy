/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, TextField } from '@fluentui/react'
import type { CausalFactor, Handler1 } from '@showwhy/types'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { useHandleKeyPress, useHandleOnBlur } from '~hooks'

export const RelevantVariablesForm: FC<{
	onAdd: Handler1<CausalFactor>
}> = memo(function RelevantVariablesForm({ onAdd }) {
	const [label, setLabel] = useState('')
	const [description, setDescription] = useState('')

	const add = useCallback(() => {
		onAdd({ variable: label, description } as CausalFactor)
		setLabel('')
		setDescription('')
	}, [onAdd, label, description, setDescription, setLabel])

	const handler = useHandleKeyPress(add, 'enter')
	const handleOnBlur = useHandleOnBlur(add, [
		'variables-form-description',
		'variables-form-variable-name',
	])

	return (
		<Container data-pw="variables-form">
			<Field
				onChange={(_, value) => setLabel(value ?? '')}
				value={label}
				placeholder="Enter label"
				data-pw="variables-form-variable-name"
				onKeyPress={label ? handler : undefined}
				onBlur={label ? handleOnBlur : undefined}
			/>
			<Field
				onChange={(_, value) => setDescription(value ?? '')}
				value={description}
				multiline={(description?.length || 0) > 70}
				resizable={false}
				placeholder="Enter description"
				data-pw="variables-form-description"
				onKeyPress={label ? handler : undefined}
				onBlur={label ? handleOnBlur : undefined}
			/>
			<ButtonContainer>
				<DefaultButton
					disabled={!label?.length}
					onClick={add}
					data-pw="variables-form-add-button"
				>
					Add
				</DefaultButton>
			</ButtonContainer>
		</Container>
	)
})

const Container = styled.form`
	display: grid;
	grid-template-columns: 30% 60% 10%;
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
