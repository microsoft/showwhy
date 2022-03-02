/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Dropdown, IDropdownOption } from '@fluentui/react'
import { useCallback } from 'react'
import type { FactorsOrDefinitions, Maybe } from '~types'

export function useRenderDropdown(
	allElements: FactorsOrDefinitions,
	onSelect: (option: Maybe<IDropdownOption<any>>, columnName: string) => void,
	dropdownOptions: IDropdownOption<any>[],
): (columnName: string) => JSX.Element {
	return useCallback(
		(columnName: string) => {
			return (
				<Dropdown
					selectedKey={
						allElements.find(a => a.column === columnName)?.id || null
					}
					onChange={(_, option) => onSelect(option, columnName)}
					style={{ width: '200px' }}
					options={dropdownOptions}
				/>
			)
		},
		[dropdownOptions, allElements, onSelect],
	)
}
