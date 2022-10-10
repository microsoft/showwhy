/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

import { CausalityLevel } from '../types/causality/CausalityLevel.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { Maybe, Setter } from '../types/primitives.js'

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
