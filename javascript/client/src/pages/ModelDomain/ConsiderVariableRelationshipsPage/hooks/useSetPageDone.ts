/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect } from 'react'

import { useAutomaticWorkflowStatus } from '~hooks'
import { useCausalFactors } from '~state'

export function useSetPageDone(): void {
	const causalFactors = useCausalFactors()
	const causes = causalFactors.flatMap(f => f.causes)
	const autoWorkflowStatus = useAutomaticWorkflowStatus()

	useEffect(() => {
		if (causes.length) {
			autoWorkflowStatus.setDone()
		} else {
			autoWorkflowStatus.setTodo()
		}
	}, [autoWorkflowStatus, causes])
}
