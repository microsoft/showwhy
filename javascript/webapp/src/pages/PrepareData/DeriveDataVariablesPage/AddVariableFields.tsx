/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption, IDropdownOption } from '@fluentui/react'
import { ComboBox, DefaultButton, Label, TextField } from '@fluentui/react'
import { DegreeComboBox } from '@showwhy/components'
import { BeliefDegree, CausalFactorType, DefinitionType } from '@showwhy/types'
import upperFirst from 'lodash/upperFirst'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { isCausalFactorType } from '~utils'

export const AddVariableFields: FC<{
	columnName: string
	onAdd: (
		variable: string,
		type: DefinitionType | CausalFactorType,
		degree?: BeliefDegree,
	) => void
}> = memo(function AddVariableFields({ columnName, onAdd }) {
	const definitions = Object.entries(DefinitionType)
	const factors = Object.entries(CausalFactorType)
	const options: IDropdownOption[] = [...definitions, ...factors].map(op => {
		return { key: op[1], text: upperFirst(op[1]) }
	})
	const [variable, setVariable] = useState(columnName)
	const [type, setType] = useState<DefinitionType | CausalFactorType>()
	const [degree, setDegree] = useState<number>(BeliefDegree.Strong)

	const onChangeDegree = useCallback(
		(option: IComboBoxOption) => {
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
			<ComboBox
				label="Type"
				selectedKey={type}
				options={options}
				onChange={(_, value) => setType(value?.key as DefinitionType)}
			/>
			{type && isCausalFactorType(type as CausalFactorType) && (
				<>
					<Label>Degree of belief</Label>
					<DegreeComboBox
						onChangeDegree={onChangeDegree}
						degree={degree}
						type={type as CausalFactorType}
					/>
				</>
			)}
			<ButtonContainer>
				<DefaultButton
					disabled={!variable || !type}
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
