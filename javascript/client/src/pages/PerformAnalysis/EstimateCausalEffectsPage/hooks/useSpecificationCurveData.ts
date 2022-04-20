/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import {
	CausalityLevel,
	DecisionFeature,
	DefinitionType,
	Experiment,
	Maybe,
	NodeResponseStatus,
	RunHistory,
	Specification,
	SpecificationCurveConfig,
} from '@showwhy/types'
import { useMemo } from 'react'
import {
	useFailedRefutationIds,
	useOnMouseOver,
	useVegaWindowDimensions,
} from '~hooks'
import {
	useExperiment,
	useHoverState,
	useRunHistory,
	useSpecificationCurveConfig,
} from '~state'
import { useLoadSpecificationData } from './useLoadSpecificationData'

export function useSpecificationCurveData(): {
	config: SpecificationCurveConfig
	failedRefutationIds: number[]
	hovered: Maybe<number>
	onMouseOver: (item: Maybe<Specification | DecisionFeature>) => void
	outcome: Maybe<string>
	vegaWindowDimensions: Dimensions
	activeProcessing: Maybe<RunHistory>
	data: Specification[]
} {
	const data = useLoadSpecificationData()
	const failedRefutationIds = useFailedRefutationIds(data)
	const config = useSpecificationCurveConfig()
	const hovered = useHoverState()
	const onMouseOver = useOnMouseOver()
	const defineQuestion = useExperiment()
	const outcome = useOutcome(defineQuestion)
	const vegaWindowDimensions = useVegaWindowDimensions()
	const runHistory = useRunHistory()
	const activeProcessing = useActiveProcessing(runHistory)

	return {
		config,
		failedRefutationIds,
		hovered,
		onMouseOver,
		outcome,
		vegaWindowDimensions,
		activeProcessing,
		data,
	}
}

function useOutcome(defineQuestion: Experiment) {
	return useMemo(
		() =>
			defineQuestion?.definitions?.find(
				d =>
					d.type === DefinitionType.Outcome &&
					d.level === CausalityLevel.Primary,
			)?.variable,
		[defineQuestion],
	)
}

function useActiveProcessing(runHistory: RunHistory[]): Maybe<RunHistory> {
	return useMemo(() => {
		return runHistory.find(
			x =>
				x.status?.status.toLowerCase() === NodeResponseStatus.Pending ||
				x.status?.status.toLowerCase() === NodeResponseStatus.Processing ||
				x.status?.status.toLowerCase() === NodeResponseStatus.Running,
		)
	}, [runHistory])
}
