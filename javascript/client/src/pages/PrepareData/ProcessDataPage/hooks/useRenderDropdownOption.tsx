/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import type {
	FactorsOrDefinitions,
	Maybe,
	CausalFactor,
	ElementDefinition,
} from '@showwhy/types'
import { useCallback } from 'react'

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
						allElements.find(
							(a: CausalFactor | ElementDefinition) => a.column === columnName,
						)?.id || null
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
