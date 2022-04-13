/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor } from '@showwhy/types'
import { useCallback } from 'react'

import { useCausalFactors, useSetCausalFactors } from '~state'

export function useDeleteFactor(): (factor: CausalFactor) => void {
	const causalFactors = useCausalFactors()
	const setCausalFactors = useSetCausalFactors()
	return useCallback(
		deletedFactor => {
			setCausalFactors(causalFactors.filter(v => v.id !== deletedFactor.id))
		},
		[causalFactors, setCausalFactors],
	)
}
