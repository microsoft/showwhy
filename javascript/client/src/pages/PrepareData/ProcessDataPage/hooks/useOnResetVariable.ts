/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuItem } from '@fluentui/react'
import type {
	ElementDefinition,
	FactorsOrDefinitions,
	Maybe,
} from '@showwhy/types'
import { useCallback } from 'react'

export function useOnResetVariable(
	allElements: FactorsOrDefinitions,
	definitionDropdown: IContextualMenuItem[],
	onSelectVariable: (
		option: Maybe<IContextualMenuItem>,
		columnName: string,
	) => void,
): (columnName: string) => void {
	return useCallback(
		(columnName: string) => {
			const id = allElements.find(
				(a: ElementDefinition) => a.column === columnName,
			)?.id
			const option = definitionDropdown
				.flatMap((x: IContextualMenuItem) =>
					x.sectionProps?.items.find(a => a.key === id),
				)
				.find(o => o)
			onSelectVariable(option, columnName)
		},
		[onSelectVariable, definitionDropdown, allElements],
	)
}
