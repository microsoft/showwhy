/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	Handler,
	Handler1,
	Maybe,
	Specification,
	SpecificationCurveConfig,
} from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { useCallback, useMemo, useState } from 'react'

import { useDefaultRun, useLoadSpecificationData, useWakeLock } from '~hooks'
import {
	useSetSignificanceTest,
	useSetSpecificationCurveConfig,
	useSpecificationCurveConfig,
} from '~state'
import { updateSignificanceTests } from '~utils'

export function useSpecificationCurve(): {
	failedRefutations: string[]
	handleConfidenceIntervalTicksChange: (checked: boolean) => void
	handleShapTicksChange: (checked: boolean) => void
	isConfidenceIntervalDisabled: boolean
	isShapDisabled: boolean
	isSpecificationOn: boolean
	onSpecificationsChange: (config: SpecificationCurveConfig) => void
	onToggleRejectEstimate: Handler
	refutationNumbers: string
	selectedSpecification: Maybe<Specification>
	setSelectedSpecification: (s: Maybe<Specification>) => void
} {
	useWakeLock()
	const data = useLoadSpecificationData()
	const [selectedSpecification, setSelectedSpecification] =
		useState<Maybe<Specification>>()

	const isShapDisabled = useIsShapDisabled()
	const handleShapTicksChange = useHandleShapTicksChange(isShapDisabled)
	const isConfidenceIntervalDisabled = useIsConfidenceIntervalDisabled(data)
	const handleConfidenceIntervalTicksChange =
		useHandleConfidenceIntervalTicksChange(isConfidenceIntervalDisabled)
	const onSpecificationsChange = useOnSpecificationsChange()

	const refutationKeys = useRefutationKeys(selectedSpecification)
	const failedRefutations = useFailedRefutations(
		selectedSpecification,
		refutationKeys,
	)
	const refutationNumbers = useRefutationNumbers(
		selectedSpecification,
		refutationKeys,
		failedRefutations,
	)
	const isSpecificationOn = useIsSpecificationOn(selectedSpecification)
	const onToggleRejectEstimate = useOnToggleRejectEstimateHandler(
		selectedSpecification,
		isSpecificationOn,
		onSpecificationsChange,
	)

	return {
		failedRefutations,
		handleConfidenceIntervalTicksChange,
		handleShapTicksChange,
		isConfidenceIntervalDisabled,
		isShapDisabled,
		isSpecificationOn,
		onSpecificationsChange,
		onToggleRejectEstimate,
		refutationNumbers,
		selectedSpecification,
		setSelectedSpecification,
	}
}

function useIsShapDisabled(): boolean {
	const defaultRun = useDefaultRun()
	return useMemo((): boolean => {
		if (!defaultRun) return false
		return defaultRun?.status?.status !== NodeResponseStatus.Completed
	}, [defaultRun])
}

function useIsConfidenceIntervalDisabled(data: Specification[]): boolean {
	const defaultRun = useDefaultRun()
	return useMemo((): boolean => {
		if (!defaultRun && data) return false
		return !defaultRun?.hasConfidenceInterval
	}, [defaultRun, data])
}

function useHandleShapTicksChange(
	isShapDisabled: boolean,
): (checked: boolean) => void {
	const config = useSpecificationCurveConfig()
	const setConfig = useSetSpecificationCurveConfig()
	return useCallback(
		checked => {
			setConfig({
				...config,
				shapTicks: isShapDisabled ? false : checked,
			})
		},
		[config, setConfig, isShapDisabled],
	)
}

function useHandleConfidenceIntervalTicksChange(
	isConfidenceIntervalDisabled: boolean,
): (checked: boolean) => void {
	const config = useSpecificationCurveConfig()
	const setConfig = useSetSpecificationCurveConfig()
	return useCallback(
		checked => {
			setConfig({
				...config,
				confidenceIntervalTicks: isConfidenceIntervalDisabled ? false : checked,
			})
		},
		[config, setConfig, isConfidenceIntervalDisabled],
	)
}

/**
 * When a specification selection change, we reset the significance test because it changes
 * based on active specifications
 */
function useOnSpecificationsChange(): Handler1<SpecificationCurveConfig> {
	const setConfig = useSetSpecificationCurveConfig()
	const defaultRun = useDefaultRun()
	const setSignificanceTest = useSetSignificanceTest()
	return useCallback(
		(config: SpecificationCurveConfig) => {
			setConfig(config)
			//missing selectedOutput
			updateSignificanceTests(setSignificanceTest, defaultRun?.id)
		},
		[setConfig, setSignificanceTest, defaultRun],
	)
}

function useRefutationKeys(
	selectedSpecification: Maybe<Specification>,
): string[] {
	return useMemo(() => {
		if (selectedSpecification) {
			const keys = Object.keys(selectedSpecification).filter(x =>
				x.startsWith('refuter'),
			)

			const refutationRun = keys.filter(
				ref => !isNaN((selectedSpecification as any)[ref]),
			)

			return refutationRun
		}
		return []
	}, [selectedSpecification])
}

function useFailedRefutations(
	selectedSpecification: Maybe<Specification>,
	refutationKeys: string[],
): string[] {
	return useMemo(() => {
		if (selectedSpecification) {
			return (
				refutationKeys.filter(
					actualKey => (selectedSpecification as any)[actualKey] === 0,
				) || []
			)
		}
		return []
	}, [selectedSpecification, refutationKeys])
}

function useRefutationNumbers(
	selectedSpecification: Maybe<Specification>,
	refutationKeys: string[],
	failedRefutations: string[],
): string {
	return useMemo(() => {
		if (selectedSpecification) {
			return (
				refutationKeys.length -
				failedRefutations.length +
				'/' +
				refutationKeys.length
			)
		}
		return '0/0'
	}, [refutationKeys, failedRefutations, selectedSpecification])
}

function useIsSpecificationOn(
	selectedSpecification: Maybe<Specification>,
): boolean {
	const { inactiveSpecifications } = useSpecificationCurveConfig()

	return useMemo(() => {
		if (!selectedSpecification || !inactiveSpecifications) {
			return false
		}
		return !inactiveSpecifications.find(x => x === selectedSpecification?.id)
	}, [inactiveSpecifications, selectedSpecification])
}

function useOnToggleRejectEstimateHandler(
	selectedSpecification: Maybe<Specification>,
	isSpecificationOn: boolean,
	onSpecificationsChange: Handler1<SpecificationCurveConfig>,
) {
	const config = useSpecificationCurveConfig()

	return useCallback(() => {
		const { inactiveSpecifications = [] } = config
		if (selectedSpecification) {
			const newInactive = inactiveSpecifications.filter(
				s => s !== selectedSpecification?.id,
			)

			if (isSpecificationOn) {
				newInactive.push(selectedSpecification.id)
			}
			onSpecificationsChange({
				...config,
				inactiveSpecifications: newInactive,
			})
		}
	}, [selectedSpecification, config, onSpecificationsChange, isSpecificationOn])
}
