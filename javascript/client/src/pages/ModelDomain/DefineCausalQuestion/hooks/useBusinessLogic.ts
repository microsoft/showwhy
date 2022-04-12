/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import type { Experiment, Maybe } from '@showwhy/types'

import { useExperiment } from '~state'

import { useOnInputChange } from './useOnInputChange'
import { useSetHypothesis } from './useSetHypothesis'
import { useSetPageDone } from './useSetPageDone'

export function useBusinessLogic(): {
	defineQuestion: Experiment
	onInputChange: (value: Maybe<string>, type: string, field: string) => void
	setHypothesis: (e: any, option: Maybe<IChoiceGroupOption>) => void
} {
	const defineQuestion = useExperiment()
	const onInputChange = useOnInputChange()
	const setHypothesis = useSetHypothesis()
	useSetPageDone()
	return {
		defineQuestion,
		onInputChange,
		setHypothesis,
	}
}
