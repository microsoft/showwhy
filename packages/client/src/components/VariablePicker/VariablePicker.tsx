/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ComboBox, IComboBoxOption } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

interface VariablePickerProps {
	onChange: (value: string) => void
	variable?: string
	showLabel?: boolean | undefined
	variables?: IComboBoxOption[]
}

export const VariablePicker: React.FC<VariablePickerProps> = memo(
	function VariablePicker({
		onChange,
		variable = '',
		showLabel = true,
		variables = [],
	}) {
		const variablesList = useMemo((): IComboBoxOption[] => {
			const newVariables = variables.filter(existing =>
				variables?.includes(existing),
			)
			if (variable.length) {
				newVariables.push({ key: variable, text: variable })
			}
			return newVariables
		}, [variables, variable])

		return (
			<Container>
				<ComboBox
					selectedKey={variable}
					label={showLabel ? 'Select a variable or create a new one' : ''}
					onChange={(_, option, index, value) =>
						onChange(option?.text ?? value ?? '')
					}
					options={variablesList}
					autoComplete={variablesList?.length ? 'on' : 'off'}
					allowFreeform={true}
					onPendingValueChanged={(option, index, value) =>
						value && onChange(value)
					}
					placeholder="Select/Type a variable"
				/>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`
