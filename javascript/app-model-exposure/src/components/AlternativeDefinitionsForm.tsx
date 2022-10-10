/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, DefaultButton } from '@fluentui/react'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'

import { useHandleKeyPress } from '../hooks/useHandleKeyPress.js'
import { useHandleOnBlur } from '../hooks/useHandleOnBlur.js'
import { CausalityLevel } from '../types/causality/CausalityLevel.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { DefinitionType } from '../types/experiments/DefinitionType.js'
import type { Handler1 } from '../types/primitives.js'
import {
	ButtonContainer,
	CheckboxContainer,
	Container,
	Field,
} from './AlternativeDefinitionsForm.styles.js'

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
