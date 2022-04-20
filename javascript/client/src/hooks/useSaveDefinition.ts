/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	ElementDefinition,
	Experiment,
} from '@showwhy/types'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import { replaceItemAtIndex } from '~utils/arrays'

export function useSaveDefinition(
	experiment: Experiment,
	setExperiment: SetterOrUpdater<Experiment>,
): (newDefinition: CausalFactor | ElementDefinition) => void {
	return useCallback(
		(newDefinition: CausalFactor | ElementDefinition) => {
			let newDefinitionList = [...(experiment?.definitions || [])]

			const index = (experiment as any)?.definitions?.findIndex(
				(x: ElementDefinition) => x.id === newDefinition?.id,
			)
			if (index > -1) {
				newDefinitionList = replaceItemAtIndex(
					newDefinitionList,
					index,
					newDefinition,
				)
			} else {
				newDefinitionList.push(newDefinition)
			}
			const newExperiment = {
				...experiment,
				definitions: newDefinitionList,
			}
			setExperiment(newExperiment)
		},
		[experiment, setExperiment],
	)
}
