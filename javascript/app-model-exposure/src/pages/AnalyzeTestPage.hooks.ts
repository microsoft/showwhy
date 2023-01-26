/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SetterOrUpdater } from 'recoil'

import { useSetEstimators } from '../state/estimators.js'
import {
	usePrimarySpecificationConfig,
	useSetPrimarySpecificationConfig,
} from '../state/primarySpecificationConfig.js'
import type { Estimator } from '../types/estimators/Estimator.js'
import type { EstimatorGroup } from '../types/estimators/EstimatorGroup.js'
import type { EstimatorType } from '../types/estimators/EstimatorType.js'
import type { PrimarySpecificationConfig } from '../types/experiments/PrimarySpecificationConfig.js'
import type { Handler, Maybe, Setter } from '../types/primitives.js'
import { estimatorGroups, ESTIMATORS } from './AnalyzeTestPage.constants.js'
import type { EstimatorCardOption } from './AnalyzeTestPage.types.js'
import {
	changeDefaultEstimator,
	getEstimatorByRanking,
	getShortDescriptionByType,
} from './AnalyzeTestPage.util.js'

export function useEstimatorOptions(
	estimators: Estimator[],
): EstimatorCardOption[] {
	const setEstimators = useSetEstimators()
	const estimatorsList = useEstimatorsList()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()

	const [selectedEstimatorGroups, setSelectedEstimatorGroups] = useState<
		EstimatorGroup[]
	>([])
	const [defaultEstimator, setDefaultEstimator] = useState<
		Maybe<EstimatorType>
	>(primarySpecificationConfig.type)

	const onEstimatorsCheckboxChange = useCallback(
		(estimator: Estimator, refutations: string) => {
			const confidenceInterval = estimators.some((x) => x.confidenceInterval)
			setEstimators((prev) =>
				prev.map((e) => e.type).includes(estimator.type)
					? prev.filter((e) => e.type !== estimator.type)
					: [
							...prev,
							{ ...estimator, refutations: +refutations, confidenceInterval },
					  ],
			)
		},
		[setEstimators, estimators],
	)

	const verifyEstimatorGroups = useVerifyEstimatorGroups(
		estimatorsList,
		estimators,
		setSelectedEstimatorGroups,
	)

	const verifyDefault = useCallback(() => {
		if (!estimators.length) return
		const isChecked = estimators.some((e) => e.type === defaultEstimator)
		if (!isChecked) {
			const newDefaultEstimator = getEstimatorByRanking(
				estimators.map((e) => e.type),
			)
			changeDefaultEstimator(
				setDefaultEstimator,
				setPrimarySpecificationConfig,
				newDefaultEstimator,
			)
		}
	}, [
		estimators,
		defaultEstimator,
		setDefaultEstimator,
		setPrimarySpecificationConfig,
	])

	const estimatorCardList = useEstimatorCardList(
		estimatorsList,
		defaultEstimator,
		estimators,
		selectedEstimatorGroups,
		onEstimatorsCheckboxChange,
		setDefaultEstimator,
		setPrimarySpecificationConfig,
	)

	useEffect(() => {
		verifyEstimatorGroups()
		verifyDefault()
	}, [estimators, verifyEstimatorGroups, verifyDefault])

	return estimatorCardList
}

export function useEstimatorCardList(
	estimatorsList: Estimator[],
	defaultEstimator: Maybe<EstimatorType>,
	estimators: Estimator[],
	selectedEstimatorGroups: EstimatorGroup[],
	onEstimatorsCheckboxChange: (
		estimator: Estimator,
		refutations: string,
	) => void,
	setDefaultEstimator: Setter<Maybe<EstimatorType>>,
	setPrimarySpecificationConfig: SetterOrUpdater<PrimarySpecificationConfig>,
): EstimatorCardOption[] {
	return useMemo(() => {
		const list = estimatorGroups.map((type) => {
			const { key } = type
			return {
				key,
				title: `${key} models`,
				description: getShortDescriptionByType(key),
				list: estimatorsList
					.filter((e) => e.group === key)
					.map((e) => {
						const estimator = estimators.find((x) => x.type === e.type)
						const checked = !!estimator
						return {
							...e,
							description: getShortDescriptionByType(e.type),
							onChange: (refutations: string) =>
								onEstimatorsCheckboxChange(e, refutations),
							checked,
							refutations: estimator?.refutations,
							confidenceInterval: estimator?.confidenceInterval,
							default: e.type === defaultEstimator,
							onDefaultChange:
								selectedEstimatorGroups.includes(e.group) && checked
									? () =>
											changeDefaultEstimator(
												setDefaultEstimator,
												setPrimarySpecificationConfig,
												e.type,
											)
									: undefined,
						}
					}),
			}
		})
		return list
	}, [
		estimatorsList,
		defaultEstimator,
		estimators,
		selectedEstimatorGroups,
		onEstimatorsCheckboxChange,
		setDefaultEstimator,
		setPrimarySpecificationConfig,
	])
}

export function useVerifyEstimatorGroups(
	estimatorsList: Estimator[],
	estimators: Estimator[],
	setSelectedEstimatorGroups: Setter<EstimatorGroup[]>,
): Handler {
	return useCallback(() => {
		estimatorGroups.forEach((item) => {
			const group: EstimatorGroup = item.key as EstimatorGroup
			const groupEstimators = estimatorsList
				.filter((e) => e.group === group)
				.map((e) => e.type)
			const hasEstimators = estimators.some((estimator) =>
				groupEstimators.includes(estimator.type),
			)
			setSelectedEstimatorGroups((prev) =>
				hasEstimators ? [...prev, group] : prev.filter((g) => g !== group),
			)
		})
	}, [estimators, estimatorsList, setSelectedEstimatorGroups])
}

export function useEstimatorsList(): Estimator[] {
	return ESTIMATORS
}
