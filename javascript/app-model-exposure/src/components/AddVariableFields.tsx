/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { DefaultButton, Dropdown, Label, TextField } from '@fluentui/react'
import upperFirst from 'lodash/upperFirst'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { useAddVariable } from '../hooks/bindData/useAddVariable.js'
import { BeliefDegree } from '../types/causality/BeliefDegree.js'
import { CausalFactorType } from '../types/causality/CausalFactorType.js'
import { DefinitionType } from '../types/experiments/DefinitionType.js'
import { isCausalFactorType } from '../utils/definition.js'
import { makeHtmlId } from '../utils/html.js'
import { BaseCallout } from './Callout.js'
import { DegreeDropdown } from './DegreeDropdown.js'

export const AddVariableFields: FC = memo(function AddVariableFields() {
	const { showCallout, toggleShowCallout, selectedColumn, onAdd } =
		useAddVariable()

	return (
		<BaseCallout
			id={makeHtmlId(selectedColumn)}
			show={showCallout}
			toggleShow={toggleShowCallout}
			title="Assign new variable"
		>
			<Fields onAdd={onAdd} columnName={selectedColumn} />
		</BaseCallout>
	)
})

interface FieldProps {
	columnName: string
	onAdd: (
		variable: string,
		type: DefinitionType | CausalFactorType,
		degree?: BeliefDegree,
	) => void
}

const Fields: FC<FieldProps> = memo(function Fields({ columnName, onAdd }) {
	const definitions = Object.entries(DefinitionType)
	const factors = Object.entries(CausalFactorType)
	const options: IDropdownOption[] = [...definitions, ...factors].map((op) => {
		return { key: op[1], text: upperFirst(op[1]) }
	})
	const [variable, setVariable] = useState(columnName)
	const [type, setType] = useState<DefinitionType | CausalFactorType>()
	const [degree, setDegree] = useState<number>(BeliefDegree.Strong)

	const onChangeDegree = useCallback(
		(option: IDropdownOption) => {
			setDegree(option.key as number)
		},
		[setDegree],
	)
	return (
		<Container>
			<TextField
				value={variable}
				onChange={(_, value) => setVariable(value as string)}
				label="Variable"
			/>
			<Dropdown
				label="Type"
				selectedKey={type}
				options={options}
				onChange={(_, value) => setType(value?.key as DefinitionType)}
			/>
			{type && isCausalFactorType(type as CausalFactorType) && (
				<>
					<Label>Degree of belief</Label>
					<DegreeDropdown
						onChangeDegree={onChangeDegree}
						degree={degree}
						type={type as CausalFactorType}
					/>
				</>
			)}
			<ButtonContainer>
				<DefaultButton
					disabled={!(variable && type)}
					onClick={() => onAdd(variable, type as DefinitionType, degree)}
				>
					Add
				</DefaultButton>
			</ButtonContainer>
		</Container>
	)
})

const Container = styled.div``

const ButtonContainer = styled.div`
	display: flex;
	justify-content: end;
	margin-top: 10px;
`
