/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { useCallback, useMemo, useState } from 'react'
import { useLoadSpecificationData } from '../pages/PerformAnalysis/ExploreSpecificationCurvePage/hooks'
import { DefinitionType, NodeResponseStatus } from '~enums'
import {
	useDefaultRun,
	useOnMouseOver,
	useWakeLock,
	useFailedRefutationIds,
	useVegaWindowDimensions,
} from '~hooks'
import { Specification, SpecificationCurveConfig } from '~interfaces'
import {
	useHoverState,
	useRunHistory,
	useSetSpecificationCurveConfig,
	useSetSignificanceTests,
	useSpecificationCurveConfig,
	useDefineQuestion,
} from '~state'
import { GenericObject } from '~types'

export function useSpecificationCurve(): GenericObject {
	const data = useLoadSpecificationData()
	const config = useSpecificationCurveConfig()
	const runHistory = useRunHistory()
	const hovered = useHoverState()
	const defaultRun = useDefaultRun()
	const onMouseOver = useOnMouseOver()
	const setConfig = useSetSpecificationCurveConfig()
	const setSignificanceTest = useSetSignificanceTests(defaultRun?.id as string)
	const failedRefutationIds = useFailedRefutationIds(data)
	const vegaWindowDimensions = useVegaWindowDimensions()
	const theme = useThematic()
	const defineQuestion = useDefineQuestion()
	const outcome = defineQuestion.outcome?.definition.find(
		d => d.level === DefinitionType.Primary,
	)?.variable
	useWakeLock()

	const activeProcessing = useMemo(() => {
		return (
			runHistory.find(
				x =>
					x.status?.status.toLowerCase() === NodeResponseStatus.Pending ||
					x.status?.status.toLowerCase() === NodeResponseStatus.Processing ||
					x.status?.status.toLowerCase() === NodeResponseStatus.Running,
			) || null
		)
	}, [runHistory])

	const [selectedSpecification, setSelectedSpecification] = useState<
		Specification | undefined
	>()

	const isShapDisabled = useMemo((): boolean => {
		if (!defaultRun) return false
		return defaultRun?.status?.status != NodeResponseStatus.Completed
	}, [defaultRun])

	const isConfidenceIntervalDisabled = useMemo((): boolean => {
		if (!defaultRun && data) return false
		return !defaultRun?.hasConfidenceInterval
	}, [defaultRun, data])

	const handleShapTicksChange = useCallback(
		checked => {
			setConfig({
				...config,
				shapTicks: isShapDisabled ? false : checked,
			})
		},
		[config, setConfig, isShapDisabled],
	)

	const handleConfidenceIntervalTicksChange = useCallback(
		checked => {
			setConfig({
				...config,
				confidenceIntervalTicks: isConfidenceIntervalDisabled ? false : checked,
			})
		},
		[config, setConfig, isConfidenceIntervalDisabled],
	)

	/**
	 * When a specification selection change, we reset the significance test because it changes
	 * based on active specifications
	 */
	const onSpecificationsChange = useCallback(
		(config: SpecificationCurveConfig) => {
			setConfig(config)
			setSignificanceTest(undefined)
		},
		[setConfig, setSignificanceTest],
	)

	return {
		data,
		defaultRun,
		activeProcessing,
		selectedSpecification,
		setSelectedSpecification,
		config,
		onSpecificationsChange,
		onMouseOver,
		hovered,
		handleShapTicksChange,
		handleConfidenceIntervalTicksChange,
		isShapDisabled,
		isConfidenceIntervalDisabled,
		failedRefutationIds,
		vegaWindowDimensions,
		theme,
		outcome,
	}
}
