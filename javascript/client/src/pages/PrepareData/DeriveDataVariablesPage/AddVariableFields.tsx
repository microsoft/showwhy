/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption, IDropdownOption } from '@fluentui/react'
import { ComboBox, DefaultButton, Label, TextField } from '@fluentui/react'
import type { CausalFactorType } from '@showwhy/types'
import { BeliefDegree, DefinitionType } from '@showwhy/types'
import upperFirst from 'lodash/upperFirst'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { useDegreeComboBox } from '~hooks'
import { isCausalFactorType } from '~utils'

export const AddVariableFields: FC<{
	columnName: string
	onAdd: (variable: string, type: DefinitionType, degree?: BeliefDegree) => void
}> = memo(function AddVariableFields({ columnName, onAdd }) {
	const options: IDropdownOption[] = Object.entries(DefinitionType).map(op => {
		return { key: op[1], text: upperFirst(op[1]) }
	})
	const [variable, setVariable] = useState(columnName)
	const [type, setType] = useState<DefinitionType>()
	const [degree, setDegree] = useState<number>(BeliefDegree.Strong)

	const onChangeDegree = useCallback(
		(option: IComboBoxOption) => {
			setDegree(option.key as number)
		},
		[setDegree],
	)
	const Combobox = useDegreeComboBox(onChangeDegree)

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
			{type && isCausalFactorType(type) && (
				<>
					<Label>Degree of belief</Label>
					{Combobox(degree, type as unknown as CausalFactorType)}
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
