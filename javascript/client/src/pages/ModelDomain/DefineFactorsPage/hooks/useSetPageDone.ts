/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactorType } from '@showwhy/types'
import { useEffect } from 'react'

import { useAutomaticWorkflowStatus } from '~hooks'
import { useCausalFactors } from '~state'

export function useSetDonePage(): void {
	const causalFactors = useCausalFactors()
	const causes = causalFactors.flatMap(f => f.causes)
	// .filter(c => c?.type === type)
	const autoWorkflowStatus = useAutomaticWorkflowStatus()

	useEffect(() => {
		if (causes.length) {
			autoWorkflowStatus.setDone()
		} else {
			autoWorkflowStatus.setTodo()
		}
	}, [autoWorkflowStatus, causes])
}
