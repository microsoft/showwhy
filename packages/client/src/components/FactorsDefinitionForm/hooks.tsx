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
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { VariablePicker } from '~components/VariablePicker'
import { DefinitionType, PageType } from '~enums'
import { CausalFactor, DescribeElements, ElementDefinition } from '~interfaces'

interface DefinitionFormProps {
	pageType: PageType
	variables?: IComboBoxOption[]
	onAdd?: (definitionOrFactor: ElementDefinition | CausalFactor) => void
	onChange?: (definitionOrFactor: ElementDefinition | CausalFactor) => void
	defineQuestion?: DescribeElements
	definitionOrFactor?: ElementDefinition | CausalFactor
}

export const useFactorsDefinitionForm = ({
	defineQuestion,
	definitionOrFactor,
	pageType,
	variables,
	onAdd,
	onChange,
}: DefinitionFormProps): {
	level
	variable
	description
} => {
	const [description, setDescription] = useState<string>()
	const [variable, setVariable] = useState<string>()
	const [isPrimary, setIsPrimary] = useState<boolean | undefined>(false)
	const location = useLocation()

	const resetFields = useCallback(() => {
		setDescription('')
		setVariable('')
		setIsPrimary(false)
	}, [setDescription, setIsPrimary])

	const add = useCallback(() => {
		const newDefinitionOrFactor: any = {
			variable,
			description,
			level: isPrimary ? DefinitionType.Primary : DefinitionType.Secondary,
		}
		onAdd && onAdd(newDefinitionOrFactor)
		resetFields()
	}, [resetFields, variable, isPrimary, description])

	useEffect(() => {
		resetFields()
		defineQuestion && setVariable(defineQuestion[pageType]?.variable)
	}, [pageType, location])

	useEffect(() => {
		defineQuestion &&
			setIsPrimary(!defineQuestion[pageType]?.definition?.length)
	}, [defineQuestion])

	useEffect(() => {
		if (definitionOrFactor) {
			setVariable(definitionOrFactor.variable)
			setDescription(definitionOrFactor.description)
			if (definitionOrFactor.hasOwnProperty('level')) {
				setIsPrimary(
					(definitionOrFactor as ElementDefinition).level ===
						DefinitionType.Primary,
				)
			}
		}
	}, [definitionOrFactor])

	useEffect(() => {
		const edited: any = { ...definitionOrFactor, variable, description }
		if (definitionOrFactor?.hasOwnProperty('level')) {
			edited.level = isPrimary
				? DefinitionType.Primary
				: DefinitionType.Secondary
		}
		onChange && onChange(edited)
	}, [variable, isPrimary, description])

	const checkbox = (
		<Checkbox
			label="Is primary?"
			checked={isPrimary}
			onChange={(_, value) => setIsPrimary(value)}
		/>
	)

	const variablePicker = (
		<VariablePicker
			variable={variable}
			onChange={setVariable}
			showLabel={false}
			variables={variables}
		/>
	)

	const descriptionBox = (
		<DetailsContainer>
			<Field
				onChange={(_, value) => setDescription(value)}
				value={description}
				placeholder="Enter description"
				multiline={(description?.length || 0) > 70}
				resizable={false}
			/>
			{!definitionOrFactor ? (
				<ButtonContainer>
					<AddButton disabled={!variable?.length} onClick={add}>
						Add
					</AddButton>
				</ButtonContainer>
			) : null}
		</DetailsContainer>
	)

	return {
		level: checkbox,
		variable: variablePicker,
		description: descriptionBox,
	}
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
