/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import { type IDropdownOption, DropdownMenuItemType } from '@fluentui/react'
import type {
	Definition,
	Handler1,
	Maybe,
	RunHistory,
	Specification,
	SpecificationCurveConfig,
} from '@showwhy/types'
import {
	CausalityLevel,
	DefinitionType,
	NodeResponseStatus,
	RefutationResult,
} from '@showwhy/types'
import { csv } from 'd3-fetch'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
	useConfounderThreshold,
	useCovariateProportionThreshold,
	useDefaultDatasetResult,
	useDefinitions,
	useHoverState,
	useRunHistory,
	useSetHoverState,
	useSpecificationCurveConfig,
} from '~state'
import {
	buildOutcomeGroups,
	returnValidatedSpecification,
	row2spec,
} from '~utils/specificationCurveManagement'

import { useDefaultRun } from './runHistory'
import { useVegaWindowDimensions } from './window'

export function useSpecificationCurveData(): {
	config: SpecificationCurveConfig
	failedRefutationTaskIds: string[]
	hovered: Maybe<string>
	onMouseOver: (item: Maybe<Specification>) => void
	outcomeOptions: IDropdownOption[]
	vegaWindowDimensions: Dimensions
	activeProcessing: Maybe<RunHistory>
	data: Specification[]
	selectedOutcome: string
	setSelectedOutcome: Handler1<string>
} {
	const [selectedOutcome, setSelectedOutcome] = useState<string>('')
	const data = useLoadSpecificationData()
	const failedRefutationTaskIds = useFailedRefutationTaskIds(data)
	const config = useSpecificationCurveConfig()
	const hovered = useHoverState()
	const onMouseOver = useOnMouseOver()
	const definitions = useDefinitions()
	const outcomeOptions = returnOutcomeOptions(definitions)
	const vegaWindowDimensions = useVegaWindowDimensions()
	const runHistory = useRunHistory()
	const activeProcessing = useActiveProcessing(runHistory)

	useEffect(() => {
		if (!selectedOutcome.length && outcomeOptions.length >= 2) {
			setSelectedOutcome(outcomeOptions[1]?.key as string)
		}
	}, [outcomeOptions, selectedOutcome, setSelectedOutcome])

	return {
		config,
		failedRefutationTaskIds,
		hovered,
		onMouseOver,
		outcomeOptions,
		selectedOutcome,
		vegaWindowDimensions,
		activeProcessing,
		data,
		setSelectedOutcome,
	}
}

export function useLoadSpecificationData(): Specification[] {
	const [data, setData] = useState<Specification[]>([])
	const defaultRun = useDefaultRun()
	const confounderThreshold = useConfounderThreshold()
	const proportionThreshold = useCovariateProportionThreshold()
	const defaultDatasetResult = useDefaultDatasetResult()

	useEffect(() => {
		if (defaultRun) {
			if (!defaultRun.result?.length) {
				setData([])
			} else {
				const result = defaultRun.result.map((x: any) => {
					const row = row2spec(x)
					return returnValidatedSpecification(
						row,
						defaultRun.confounderThreshold,
						defaultRun.proportionThreshold,
					)
				}) as Specification[]
				setData(buildOutcomeGroups(result))
			}
		} else if (!defaultRun) {
			if (defaultDatasetResult) {
				const f = async () => {
					try {
						const result = await csv(defaultDatasetResult?.url, row2spec)
						let specResult = buildOutcomeGroups(result)
						specResult = result.map(x => {
							return returnValidatedSpecification(
								x,
								confounderThreshold,
								proportionThreshold,
							)
						}) as Specification[]

						setData(specResult)
					} catch (err) {
						setData([])
					}
				}
				f()
			}
		}
	}, [
		setData,
		defaultRun,
		defaultDatasetResult,
		confounderThreshold,
		proportionThreshold,
	])
	return data
}

function returnOutcomeOptions(definitions: Definition[]): IDropdownOption[] {
	const outcomes = definitions.filter(d => d.type === DefinitionType.Outcome)
	const primary = outcomes.filter(d => d.level === CausalityLevel.Primary)
	const secondary = outcomes.filter(d => d.level === CausalityLevel.Secondary)
	const options: IDropdownOption[] = [
		{
			key: 'primaryHeader',
			text: 'Primary',
			itemType: DropdownMenuItemType.Header,
		},
	]

	primary.forEach(d => {
		options.push({ key: d.variable, text: d.variable })
	})

	if (secondary.length) {
		options.push({
			key: 'secondaryKey',
			text: 'Secondary',
			itemType: DropdownMenuItemType.Header,
		})

		secondary.forEach(d => {
			options.push({ key: d.variable, text: d.variable })
		})
	}

	return options
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

export function useFailedRefutationTaskIds(data: Specification[]): string[] {
	return useMemo((): string[] => {
		return (
			data
				.filter(x => +x.refutationResult === RefutationResult.FailedCritical)
				.map(a => a.taskId) || []
		)
	}, [data])
}

function useOnMouseOver(): (item: Maybe<Specification>) => void {
	const setHovered = useSetHoverState()
	return useCallback(
		(item: Maybe<Specification>) => {
			setHovered(item?.id)
		},
		[setHovered],
	)
}
