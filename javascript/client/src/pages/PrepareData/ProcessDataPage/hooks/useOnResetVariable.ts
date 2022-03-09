/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption } from '@fluentui/react'
import type {
	ElementDefinition,
	FactorsOrDefinitions,
	Maybe,
} from '@showwhy/types'
import { useCallback } from 'react'

export function useOnResetVariable(
	allElements: FactorsOrDefinitions,
	definitionDropdown: IDropdownOption<any>[],
	onSelectVariable: (
		option: Maybe<IDropdownOption<any>>,
		columnName: string,
	) => void,
): (columnName: string) => void {
	return useCallback(
		(columnName: string) => {
			const id = allElements.find(
				(a: ElementDefinition) => a.column === columnName,
			)?.id
			const option = definitionDropdown.find(
				(x: IDropdownOption) => x.key === id,
			)
			onSelectVariable(option, columnName)
		},
		[onSelectVariable, definitionDropdown, allElements],
	)
}
