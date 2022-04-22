/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect } from 'react'

import { useAutomaticWorkflowStatus } from '~hooks'
import { useQuestion } from '~state'

export function useSetPageDone(): void {
	const experiment = useQuestion()
	const { exposure, population, outcome } = experiment || {}
	const autoWorkflowStatus = useAutomaticWorkflowStatus()

	useEffect(() => {
		if (population?.label && exposure?.label && outcome?.label) {
			autoWorkflowStatus.setDone()
		} else {
			autoWorkflowStatus.setTodo()
		}
	}, [autoWorkflowStatus, population, exposure, outcome])
}
