/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CausalFactor, Definition } from '@showwhy/types'
import { useMemo } from 'react'

import { useAllVariables } from '../../../../hooks'
import { useSubjectIdentifier } from '../../../../state'

export function useCompletedElements(): number {
	const allElements = useAllVariables()
	const subjectIdentifier = useSubjectIdentifier()
	return useMemo((): number => {
		const initial = !!subjectIdentifier ? 1 : 0
		return allElements.find((x: CausalFactor | Definition) => x)
			? allElements?.filter((x: CausalFactor | Definition) => x.column).length +
					initial
			: initial
	}, [allElements, subjectIdentifier])
}
