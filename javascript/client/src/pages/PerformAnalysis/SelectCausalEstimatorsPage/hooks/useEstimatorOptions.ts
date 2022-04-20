/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Estimator,
	EstimatorGroup,
	EstimatorType,
	Maybe,
} from '@showwhy/types'
import { useCallback, useEffect, useState } from 'react'

import {
	useConfidenceInterval,
	usePrimarySpecificationConfig,
	useSetConfidenceInterval,
	useSetEstimators,
	useSetPrimarySpecificationConfig,
} from '~state'

import type { EstimatorCardOption } from '../SelectCausalEstimatorsPage.types'
import {
	changeDefaultEstimator,
	getEstimatorByRanking,
} from '../SelectCausalEstimatorsPage.utils'
import { useBatchUpdate } from './useBatchUpdate'
import { useEstimatorCardList } from './useEstimatorCardList'
import { useEstimatorsList } from './useEstimatorsList'
import { useOnEstimatorTypeChange } from './useOnEstimatorTypeChange'
import { useVerifyEstimatorGroups } from './useVerifyEstimatorGroups'

export function useEstimatorOptions(
	estimators: Estimator[],
): EstimatorCardOption[] {
	const setEstimators = useSetEstimators()
	const estimatorsList = useEstimatorsList()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const setConfidenceInterval = useSetConfidenceInterval()
	const confidenceInterval = useConfidenceInterval()

	const [selectedEstimatorGroups, setSelectedEstimatorGroups] = useState<
		EstimatorGroup[]
	>([])
	const [defaultEstimator, setDefaultEstimator] = useState<
		Maybe<EstimatorType>
	>(primarySpecificationConfig.type)

	const onEstimatorsCheckboxChange = useCallback(
		(estimator: Estimator) => {
			setEstimators(prev =>
				prev.map(e => e.type).includes(estimator.type)
					? prev.filter(e => e.type !== estimator.type)
					: [...prev, estimator],
			)
		},
		[setEstimators],
	)

	const batchUpdateSelectedEstimators = useBatchUpdate(setEstimators)
	const verifyEstimatorGroups = useVerifyEstimatorGroups(
		estimatorsList,
		estimators,
		setSelectedEstimatorGroups,
	)
	const onEstimatorTypeChange = useOnEstimatorTypeChange(
		estimatorsList,
		selectedEstimatorGroups,
		batchUpdateSelectedEstimators,
		setSelectedEstimatorGroups,
	)

	const verifyDefault = useCallback(() => {
		if (!estimators.length) return
		const isChecked = estimators.some(e => e.type === defaultEstimator)
		if (!isChecked) {
			const newDefaultEstimator = getEstimatorByRanking(
				estimators.map(e => e.type),
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

	const verifyConfidenceIntervals = useCallback(() => {
		if (!estimators?.length) {
			setConfidenceInterval(false)
		}
	}, [estimators, setConfidenceInterval])

	const toggleConfidenceInterval = useCallback(() => {
		if (estimators?.length) {
			setConfidenceInterval(prev => !prev)
		}
	}, [estimators, setConfidenceInterval])

	const estimatorCardList = useEstimatorCardList(
		estimatorsList,
		defaultEstimator,
		estimators,
		selectedEstimatorGroups,
		onEstimatorTypeChange,
		onEstimatorsCheckboxChange,
		setDefaultEstimator,
		setPrimarySpecificationConfig,
		confidenceInterval,
		toggleConfidenceInterval,
	)

	useEffect(() => {
		verifyEstimatorGroups()
		verifyDefault()
		verifyConfidenceIntervals()
	}, [
		estimators,
		confidenceInterval,
		verifyEstimatorGroups,
		verifyDefault,
		verifyConfidenceIntervals,
	])

	return estimatorCardList
}
