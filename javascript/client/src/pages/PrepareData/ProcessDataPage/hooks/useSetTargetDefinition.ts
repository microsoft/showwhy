/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition, Experiment } from '@showwhy/types'
import { useCallback } from 'react'
import { PageType } from '~types'

export function useSetTargetDefinition(
	saveDefinition: (definition: ElementDefinition, type: PageType) => void,
	defineQuestionData: Experiment,
): (selectedDefinitionId: string, column: string) => void {
	return useCallback(
		(selectedDefinitionId: string, column: string) => {
			const { population, exposure, outcome } = defineQuestionData
			const all: ElementDefinition[] = []
			population &&
				all.push(...population.definition.map((a: ElementDefinition) => a))
			exposure &&
				all.push(...exposure.definition.map((a: ElementDefinition) => a))
			outcome &&
				all.push(...outcome.definition.map((a: ElementDefinition) => a))

			const newDefinition = {
				...all?.find(x => x.id === selectedDefinitionId),
			} as ElementDefinition

			if (newDefinition) {
				newDefinition.column =
					newDefinition.column === column ? undefined : column
			}
			const type = population?.definition.find(
				(x: ElementDefinition) => x.id === selectedDefinitionId,
			)
				? PageType.Population
				: exposure.definition.find(
						(x: ElementDefinition) => x.id === selectedDefinitionId,
				  )
				? PageType.Exposure
				: PageType.Outcome

			saveDefinition(newDefinition, type)
		},
		[saveDefinition, defineQuestionData],
	)
}
