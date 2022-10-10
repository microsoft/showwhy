/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'

import { useHandleKeyPress } from '../hooks/useHandleKeyPress.js'
import { useHandleOnBlur } from '../hooks/useHandleOnBlur.js'
import type { CausalFactor } from '../types/causality/CausalFactor.js'
import type { Handler1 } from '../types/primitives.js'
import {
	ButtonContainer,
	Container,
	Field,
} from './RelevantVariablesForm.styles.js'

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
