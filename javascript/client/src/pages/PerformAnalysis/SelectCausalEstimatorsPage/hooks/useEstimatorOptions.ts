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
	useEstimatorShortDescription,
	useEstimatorsList,
	useToggleConfidenceInterval,
} from '~hooks'
import {
	useConfidenceInterval,
	useEstimators,
	usePrimarySpecificationConfig,
	useSetConfidenceInterval,
	useSetEstimators,
	useSetPrimarySpecificationConfig,
} from '~state'

import {
	useBatchUpdate,
	useEstimatorCardList,
	useOnDefaultChange,
	useOnEstimatorTypeChange,
	useVerifyEstimatorGroups,
} from '../SelectCausalEstimatorsPage.hooks'
import type { EstimatorCardOption } from '../SelectCausalEstimatorsPage.types'
import { getEstimatorByRanking } from '../SelectCausalEstimatorsPage.utils'

export function useEstimatorOptions(): EstimatorCardOption[] {
	const estimators = useEstimators()
	const setEstimators = useSetEstimators()
	const estimatorsList = useEstimatorsList()
	const estimatorShortDescription = useEstimatorShortDescription()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const setConfidenceInterval = useSetConfidenceInterval()
	const toggleConfidenceInterval = useToggleConfidenceInterval()
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
	const onDefaultChange = useOnDefaultChange(
		setDefaultEstimator,
		setPrimarySpecificationConfig,
	)

	const verifyDefault = useCallback(() => {
		if (!estimators.length) return
		const isChecked = estimators.some(e => e.type === defaultEstimator)
		if (!isChecked) {
			const newDefaultEstimator = getEstimatorByRanking(
				estimators.map(e => e.type),
			)
			onDefaultChange(newDefaultEstimator)
		}
	}, [estimators, defaultEstimator, onDefaultChange])

	const verifyConfidenceIntervals = useCallback(() => {
		if (!estimators?.length) {
			setConfidenceInterval(false)
		}
	}, [estimators, setConfidenceInterval])

	const estimatorCardList = useEstimatorCardList(
		estimatorsList,
		defaultEstimator,
		estimators,
		selectedEstimatorGroups,
		onDefaultChange,
		onEstimatorTypeChange,
		onEstimatorsCheckboxChange,
		estimatorShortDescription,
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
