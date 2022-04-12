/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import type { Experiment, Hypothesis, Maybe } from '@showwhy/types'
import { useCallback } from 'react'

import { useExperiment, useSetExperiment } from '~state'

export function useSetHypothesis(): (
	e: any,
	option: Maybe<IChoiceGroupOption>,
) => void {
	const defineQuestion = useExperiment()
	const setDefineQuestion = useSetExperiment()
	return useCallback(
		(_e, option) => {
			if (option) {
				const newQuestion: Experiment = { ...defineQuestion }
				newQuestion.hypothesis = option.key as Hypothesis
				setDefineQuestion(newQuestion)
			}
		},
		[defineQuestion, setDefineQuestion],
	)
}
