/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import type {
	Definition,
	Maybe,
	RunHistory,
	Specification,
	SpecificationCurveConfig,
} from '@showwhy/types'
import {
	DefinitionType,
	NodeResponseStatus,
	RefutationResult,
} from '@showwhy/types'
import { csv } from 'd3-fetch'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDefaultRun, useVegaWindowDimensions } from '~hooks'
import {
	useDefaultDatasetResult,
	useDefinitions,
	useHoverState,
	useRunHistory,
	useSetHoverState,
	useSpecificationCurveConfig,
} from '~state'
import { row2spec } from '~utils'

export function useSpecificationCurveData(): {
	config: SpecificationCurveConfig
	failedRefutationIds: string[]
	hovered: Maybe<number>
	onMouseOver: (item: Maybe<Specification>) => void
	outcomes: Definition[]
	vegaWindowDimensions: Dimensions
	activeProcessing: Maybe<RunHistory>
	data: Specification[]
} {
	const data = useLoadSpecificationData()
	const failedRefutationIds = useFailedRefutationIds(data)
	const config = useSpecificationCurveConfig()
	const hovered = useHoverState()
	const onMouseOver = useOnMouseOver()
	const definitions = useDefinitions()
	const outcomes = useOutcomes(definitions)
	const vegaWindowDimensions = useVegaWindowDimensions()
	const runHistory = useRunHistory()
	const activeProcessing = useActiveProcessing(runHistory)

	return {
		config,
		failedRefutationIds,
		hovered,
		onMouseOver,
		outcomes,
		vegaWindowDimensions,
		activeProcessing,
		data,
	}
}

export function useLoadSpecificationData(): Specification[] {
	const [data, setData] = useState<Specification[]>([])
	const defaultRun = useDefaultRun()
	const defaultDatasetResult = useDefaultDatasetResult()

	useEffect(() => {
		if (defaultRun) {
			if (!defaultRun.result?.length) {
				setData([])
			} else {
				const result = defaultRun.result.map((x: any, index) => {
					const n = { ...x, index: index + 1 }
					return row2spec(n)
				}) as Specification[]
				const newResult = result
					?.sort(function (a, b) {
						return a?.estimatedEffect - b?.estimatedEffect
					})
					.map((x, index) => ({ ...x, index: index + 1 }))

				setData(newResult)
			}
		} else if (!defaultRun) {
			if (defaultDatasetResult) {
				const f = async () => {
					try {
						const result = await csv(defaultDatasetResult?.url, row2spec)
						setData(result.map((x, index) => ({ ...x, index: index + 1 })))
					} catch (err) {
						setData([])
					}
				}
				f()
			}
		}
	}, [setData, defaultRun, defaultDatasetResult])
	return data
}

function useOutcomes(definitions: Definition[]): Definition[] {
	return useMemo(
		() => definitions.filter(d => d.type === DefinitionType.Outcome),
		[definitions],
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

export function useFailedRefutationIds(data: Specification[]): string[] {
	return useMemo((): string[] => {
		return (
			data
				.filter(x => +x.refutationResult === RefutationResult.FailedCritical)
				.map(a => a.id) || []
		)
	}, [data])
}

function useOnMouseOver(): (item: Maybe<Specification>) => void {
	const setHovered = useSetHoverState()
	return useCallback(
		(item: Maybe<Specification>) => {
			setHovered(item?.index)
		},
		[setHovered],
	)
}
