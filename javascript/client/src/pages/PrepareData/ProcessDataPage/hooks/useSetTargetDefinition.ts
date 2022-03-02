/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { ElementDefinition, Experiment, PageType } from '~types'

export function useSetTargetDefinition(
	saveDefinition: (definition: ElementDefinition, type: PageType) => void,
	defineQuestionData: Experiment,
): (selectedDefinitionId: string, column: string) => void {
	return useCallback(
		(selectedDefinitionId: string, column: string) => {
			const { population, exposure, outcome } = defineQuestionData
			const all: ElementDefinition[] = []
			population && all.push(...population.definition.map(a => a))
			exposure && all.push(...exposure.definition.map(a => a))
			outcome && all.push(...outcome.definition.map(a => a))

			const newDefinition = {
				...all?.find(x => x.id === selectedDefinitionId),
			} as ElementDefinition

			if (newDefinition) {
				newDefinition.column =
					newDefinition.column === column ? undefined : column
			}
			const type = population?.definition.find(
				x => x.id === selectedDefinitionId,
			)
				? PageType.Population
				: exposure.definition.find(x => x.id === selectedDefinitionId)
				? PageType.Exposure
				: PageType.Outcome

			saveDefinition(newDefinition, type)
		},
		[saveDefinition, defineQuestionData],
	)
}
