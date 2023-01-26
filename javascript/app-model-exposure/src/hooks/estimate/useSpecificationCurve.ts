/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo, useState } from 'react'

import { isStatus } from '../../api-client/utils.js'
import { useSetSignificanceTest } from '../../state/significanceTests.js'
import {
	useSetSpecificationCurveConfig,
	useSpecificationCurveConfig,
} from '../../state/specificationCurveConfig.js'
import { NodeResponseStatus } from '../../types/api/NodeResponseStatus.js'
import type { Handler, Handler1, Maybe } from '../../types/primitives.js'
import type { Specification } from '../../types/visualization/Specification.js'
import type { SpecificationCurveConfig } from '../../types/visualization/SpecificationCurveConfig.js'
import { updateSignificanceTests } from '../../utils/significanceTests.js'
import { useDefaultRun } from '../runHistory.js'
import { useWakeLock } from '../useWakeLock.js'

export function useSpecificationCurve(data: Specification[]): {
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
		return !isStatus(defaultRun?.status, NodeResponseStatus.Success)
	}, [defaultRun])
}

function useIsConfidenceIntervalDisabled(data: Specification[]): boolean {
	const defaultRun = useDefaultRun()
	return useMemo((): boolean => {
		if (!defaultRun && data) return false
		return !defaultRun?.estimators.some((r) => r.confidenceInterval)
	}, [defaultRun, data])
}

function useHandleShapTicksChange(
	isShapDisabled: boolean,
): (checked: boolean) => void {
	const config = useSpecificationCurveConfig()
	const setConfig = useSetSpecificationCurveConfig()
	return useCallback(
		(checked) => {
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
		(checked) => {
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
			const keys = Object.keys(selectedSpecification).filter((x) =>
				x.startsWith('refuter'),
			)

			const refutationRun = keys.filter(
				/* eslint-disable-next-line */
				(ref) => !isNaN((selectedSpecification as any)[ref]),
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
					/* eslint-disable-next-line */
					(actualKey) => (selectedSpecification as any)[actualKey] === 0,
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
			return `${refutationKeys.length - failedRefutations.length}/${
				refutationKeys.length
			}`
		}
		return '0/0'
	}, [refutationKeys, failedRefutations, selectedSpecification])
}

function useIsSpecificationOn(
	selectedSpecification: Maybe<Specification>,
): boolean {
	const { inactiveSpecifications } = useSpecificationCurveConfig()

	return useMemo(() => {
		if (!(selectedSpecification && inactiveSpecifications)) {
			return false
		}
		return !inactiveSpecifications.find((x) => x === selectedSpecification?.id)
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
				(s) => s !== selectedSpecification?.id,
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
