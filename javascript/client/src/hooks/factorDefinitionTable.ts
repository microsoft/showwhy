/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition, Maybe, Setter } from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'
import { useCallback } from 'react'

export function useOnChange(
	set: Setter<Maybe<ElementDefinition>>,
	valueToEdit: Maybe<{ id: string }>,
): (value: Partial<ElementDefinition>) => void {
	return useCallback(
		(value: Partial<ElementDefinition>) => {
			set({
				...value,
				description: value.description ?? '',
				variable: value?.variable ?? '',
				level: value?.level ?? CausalityLevel.Primary,
				id: valueToEdit?.id || '',
			})
		},
		[set, valueToEdit],
	)
}
