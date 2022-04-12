/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefinitionType } from '@showwhy/types'
import { useEffect } from 'react'

import { useAutomaticWorkflowStatus } from '~hooks'
import { useExperiment } from '~state'
import { getDefinitionsByType } from '~utils'

export function useSetPageDone(): void {
	const experiment = useExperiment()
	const { definitions } = experiment || {}
	const population = getDefinitionsByType(
		DefinitionType.Population,
		definitions,
	)
	const exposure = getDefinitionsByType(DefinitionType.Exposure, definitions)
	const outcome = getDefinitionsByType(DefinitionType.Outcome, definitions)
	const autoWorkflowStatus = useAutomaticWorkflowStatus()

	useEffect(() => {
		if (population.length && exposure.length && outcome.length) {
			autoWorkflowStatus.setDone()
		} else {
			autoWorkflowStatus.setTodo()
		}
	}, [autoWorkflowStatus, population, exposure, outcome])
}
