/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IDropdownOption } from '@fluentui/react'
import { useCallback } from 'react'
import { FactorsOrDefinitions, Maybe } from '~types'

export function useOnResetVariable(
	allElements: FactorsOrDefinitions,
	definitionDropdown: IDropdownOption<any>[],
	onSelectVariable: (
		option: Maybe<IDropdownOption<any>>,
		columnName: string,
	) => void,
) {
	return useCallback(
		(columnName: string) => {
			const id = allElements.find(a => a.column === columnName)?.id
			const option = definitionDropdown.find(x => x.key === id)
			onSelectVariable(option, columnName)
		},
		[onSelectVariable, definitionDropdown, allElements],
	)
}
