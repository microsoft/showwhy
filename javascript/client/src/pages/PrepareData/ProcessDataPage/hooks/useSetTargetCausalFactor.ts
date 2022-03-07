/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor } from '@showwhy/types'
import { useCallback } from 'react'

export function useSetTargetCausalFactor(
	saveCausalFactor: (causalFactor: CausalFactor) => void,
	causalFactors: CausalFactor[],
): (selectedDefinitionId: string, column: string) => void {
	return useCallback(
		(selectedDefinitionId: string, column: string) => {
			const selectedCausal = {
				...causalFactors.find(x => x.id === selectedDefinitionId),
			} as CausalFactor

			if (selectedCausal) {
				selectedCausal.column =
					selectedCausal.column === column ? undefined : column
			}

			saveCausalFactor(selectedCausal)
		},
		[causalFactors, saveCausalFactor],
	)
}
