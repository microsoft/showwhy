/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption, ISelectableOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import type {
	CausalFactor,
	ElementDefinition,
	FactorsOrDefinitions,
	Maybe,
} from '@showwhy/types'
import { useCallback } from 'react'
import styled from 'styled-components'

export function useRenderDropdown(
	allElements: FactorsOrDefinitions,
	onSelect: (option: Maybe<IDropdownOption<any>>, columnName: string) => void,
	onResetVariable: (columnName: string) => void,
	dropdownOptions: IDropdownOption<any>[],
): (columnName: string) => JSX.Element {
	const handleRenderOption = useCallback(
		(columnName: string, option?: ISelectableOption<any>) => {
			if (option?.data?.button) {
				const isDisabled = !allElements.find(
					(x: ElementDefinition | CausalFactor) => x.column === columnName,
				)

				return (
					<Selector key={option?.key}>
						<Link
							disabled={isDisabled}
							onClick={() => !isDisabled && onResetVariable(columnName)}
						>
							Reset
						</Link>
					</Selector>
				)
			} else {
				return <span key={option?.key}>{option?.text}</span>
			}
		},
		[onResetVariable, allElements],
	)

	return useCallback(
		(columnName: string) => {
			return (
				<Dropdown
					selectedKey={
						allElements.find(
							(a: CausalFactor | ElementDefinition) => a.column === columnName,
						)?.id || null
					}
					onChange={(_, option) => onSelect(option, columnName)}
					style={{ width: '200px' }}
					options={dropdownOptions}
					onRenderOption={(option?: ISelectableOption<any>) =>
						handleRenderOption(columnName, option)
					}
				/>
			)
		},
		[dropdownOptions, allElements, onSelect, handleRenderOption],
	)
}

const Selector = styled.div`
	display: flex;
	justify-content: space-around;
`

const Link = styled.a<{ disabled: boolean }>`
	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
	color: ${({ theme, disabled }) =>
		disabled
			? theme.application().lowMidContrast().hex()
			: theme.application().accent().hex()};
`
