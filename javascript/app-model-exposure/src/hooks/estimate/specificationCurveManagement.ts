/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Dimensions } from '@essex/hooks'
import type { IDropdownOption } from '@fluentui/react'
import { DropdownMenuItemType } from '@fluentui/react'
import { csv } from 'd3-fetch'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useConfounderThreshold } from '../../state/confounderThreshold.js'
import { useDefaultDatasetResult } from '../../state/defaultDatasetResult.js'
import { useDefinitions } from '../../state/definitions.js'
import { useRunHistory } from '../../state/runHistory.js'
import {
	useHoverState,
	useSetHoverState,
	useSpecificationCurveConfig,
} from '../../state/specificationCurveConfig.js'
import { NodeResponseStatus } from '../../types/api/NodeResponseStatus.js'
import { CausalityLevel } from '../../types/causality/CausalityLevel.js'
import type { Definition } from '../../types/experiments/Definition.js'
import { DefinitionType } from '../../types/experiments/DefinitionType.js'
import type { Handler1, Maybe } from '../../types/primitives.js'
import { RefutationResult } from '../../types/refutation/RefutationResult.js'
import type { RunHistory } from '../../types/runs/RunHistory.js'
import type { Specification } from '../../types/visualization/Specification.js'
import type { SpecificationCurveConfig } from '../../types/visualization/SpecificationCurveConfig.js'
import {
	buildOutcomeGroups,
	returnValidatedSpecification,
	row2spec,
} from '../../utils/specificationCurveManagement.js'
import { useDefaultRun } from '../runHistory.js'
import { useVegaWindowDimensions } from '../window.js'
import { useEstimateData } from './useEstimateData.js'

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
	const specificationList = useEstimateData()
	const confounderThreshold = useConfounderThreshold()
	const defaultDatasetResult = useDefaultDatasetResult()
	useEffect(() => {
		if (defaultRun && specificationList?.length) {
			if (!specificationList?.length) {
				setData([])
			} else {
				const result = specificationList.map(row => {
					const spec = row2spec(row)
					return returnValidatedSpecification(
						spec,
						defaultRun.confounderThreshold,
					)
				}) as Specification[]
				setData(buildOutcomeGroups(result))
			}
		} else if (defaultDatasetResult) {
			const f = async (): Promise<void> => {
				try {
					const result = await csv(defaultDatasetResult?.url, row2spec)
					let specResult = buildOutcomeGroups(result)
					specResult = specResult.map(x => {
						return returnValidatedSpecification(x, confounderThreshold)
					}) as Specification[]

					setData(specResult)
				} catch (err) {
					setData([])
				}
			}
			/* eslint-disable-next-line */
			f()
		}
	}, [
		setData,
		defaultRun,
		specificationList,
		defaultDatasetResult,
		confounderThreshold,
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
				x.status?.toLowerCase() === NodeResponseStatus.Pending ||
				x.status?.toLowerCase() === NodeResponseStatus.Started,
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
