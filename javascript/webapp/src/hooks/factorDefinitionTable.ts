/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Definition, Maybe, Setter } from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'
import { useCallback } from 'react'

export function useOnChange(
	set: Setter<Maybe<Definition>>,
	valueToEdit: Maybe<{ id: string }>,
): (value: Partial<Definition>) => void {
	return useCallback(
		(value: Partial<Definition>) => {
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
