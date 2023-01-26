/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuItem } from '@fluentui/react'
import { useCallback } from 'react'

import type { CausalFactor } from '../../types/causality/CausalFactor.js'
import type { Definition } from '../../types/experiments/Definition.js'
import type { Maybe } from '../../types/primitives.js'

export function useOnResetVariable(
	allElements: CausalFactor[] | Definition[],
	definitionDropdown: IContextualMenuItem[],
	onSelectVariable: (
		option: Maybe<IContextualMenuItem>,
		columnName: string,
	) => void,
): (columnName: string) => void {
	return useCallback(
		(columnName: string) => {
			const id = allElements.find(
				(a: Definition) => a.column === columnName,
			)?.id
			if (!id) return
			const option = definitionDropdown
				.flatMap((x: IContextualMenuItem) =>
					x.sectionProps?.items.find((a) => a.key === id),
				)
				.find((o) => o)
			onSelectVariable(option, columnName)
		},
		[onSelectVariable, definitionDropdown, allElements],
	)
}
