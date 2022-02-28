/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Setter, Maybe, Handler } from '@showwhy/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SetterOrUpdater } from 'recoil'
import { getEstimatorByRanking, estimatorGroups } from './constants'
import { useEstimatorShortDescription, useEstimatorsList } from '~hooks'
import {
	useSetEstimators,
	useSetPrimarySpecificationConfig,
	usePrimarySpecificationConfig,
	useEstimators,
	useSetConfidenceInterval,
	useToggleConfidenceInterval,
	useConfidenceInterval,
} from '~state'
import type {
	EstimatorGroup,
	EstimatorType,
	Estimator,
	PrimarySpecificationConfig,
} from '~types'

enum BatchUpdateAction {
	Delete = 'delete',
	Add = 'add',
}

export function useEstimatorHook(): {
	estimatorCardList: ReturnType<typeof useEstimatorCardList>
} {
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

	return {
		estimatorCardList,
	}
}

function useBatchUpdate(
	setEstimators: SetterOrUpdater<Estimator[]>,
): (estimators: Estimator[], action: BatchUpdateAction) => void {
	return useCallback(
		(estimators: Estimator[], action: BatchUpdateAction) => {
			switch (action) {
				case BatchUpdateAction.Add:
					setEstimators(prev => [
						...prev,
						...estimators.filter(
							estimator => !prev.map(e => e.type).includes(estimator.type),
						),
					])
					break
				case BatchUpdateAction.Delete:
					setEstimators(prev =>
						prev.filter(
							estimator =>
								!estimators.map(e => e.type).includes(estimator.type),
						),
					)
					break
				default:
					return
			}
		},
		[setEstimators],
	)
}

function useVerifyEstimatorGroups(
	estimatorsList: Estimator[],
	estimators: Estimator[],
	setSelectedEstimatorGroups: Setter<EstimatorGroup[]>,
) {
	return useCallback(() => {
		estimatorGroups.forEach(item => {
			const group: EstimatorGroup = item.key as EstimatorGroup
			const groupEstimators = estimatorsList
				.filter(e => e.group === group)
				.map(e => e.type)
			const hasEstimators = estimators.some(estimator =>
				groupEstimators.includes(estimator.type),
			)
			setSelectedEstimatorGroups(prev =>
				hasEstimators ? [...prev, group] : prev.filter(g => g !== group),
			)
		})
	}, [estimators, estimatorsList, setSelectedEstimatorGroups])
}

function useOnEstimatorTypeChange(
	estimatorsList: Estimator[],
	selectedEstimatorGroups: EstimatorGroup[],
	batchUpdateSelectedEstimators: (
		estimators: Estimator[],
		action: BatchUpdateAction,
	) => void,
	setSelectedEstimatorGroups: Setter<EstimatorGroup[]>,
) {
	return useCallback(
		(group: EstimatorGroup) => {
			const action: BatchUpdateAction = selectedEstimatorGroups.includes(group)
				? BatchUpdateAction.Delete
				: BatchUpdateAction.Add
			batchUpdateSelectedEstimators(
				estimatorsList.filter(e => e.group === group),
				action,
			)
			setSelectedEstimatorGroups(prev =>
				prev.includes(group) ? prev.filter(e => e !== group) : [...prev, group],
			)
		},
		[
			estimatorsList,
			selectedEstimatorGroups,
			batchUpdateSelectedEstimators,
			setSelectedEstimatorGroups,
		],
	)
}

function useOnDefaultChange(
	setDefaultEstimator: Setter<Maybe<EstimatorType>>,
	setPrimarySpecificationConfig: SetterOrUpdater<PrimarySpecificationConfig>,
) {
	return useCallback(
		(type: EstimatorType) => {
			setDefaultEstimator(type)
			setPrimarySpecificationConfig(prev => ({
				...prev,
				type,
			}))
		},
		[setDefaultEstimator, setPrimarySpecificationConfig],
	)
}

function useEstimatorCardList(
	estimatorsList: Estimator[],
	defaultEstimator: Maybe<EstimatorType>,
	estimators: Estimator[],
	selectedEstimatorGroups: EstimatorGroup[],
	onDefaultChange: (type: EstimatorType) => void,
	onEstimatorTypeChange: (group: EstimatorGroup) => void,
	onEstimatorsCheckboxChange: (estimator: Estimator) => void,
	estimatorShortDescription: (type: string) => string,
	confidenceInterval: boolean,
	onConfidenceIntervalsChange: Handler,
) {
	return useMemo(() => {
		const list = estimatorGroups.map(type => {
			const { key } = type
			return {
				key,
				title: `${key} models`,
				description: estimatorShortDescription(key),
				onCardClick: () => onEstimatorTypeChange(key as EstimatorGroup),
				isCardChecked: selectedEstimatorGroups.includes(key as EstimatorGroup),
				list: estimatorsList
					.filter(e => e.group === key)
					.map(e => {
						const isChecked = estimators.map(e => e.type).includes(e.type)
						return {
							...e,
							description: estimatorShortDescription(e.type),
							onChange: () => onEstimatorsCheckboxChange(e),
							isChecked,
							isDefault: e.type === defaultEstimator,
							onDefaultChange:
								selectedEstimatorGroups.includes(e.group) && isChecked
									? () => onDefaultChange(e.type)
									: undefined,
						}
					}),
			}
		})
		list.push({
			key: 'confidence-intervals',
			title: 'Compute confidence intervals',
			description:
				'Exposure-assignment and Linear Regression models compute confidence intervals by repeatedly rerunning the estimates with bootstrapped samples, which may take a while to execute.',
			onCardClick: onConfidenceIntervalsChange,
			isCardChecked: confidenceInterval,
			list: [],
		})
		return list
	}, [
		estimatorsList,
		defaultEstimator,
		estimators,
		selectedEstimatorGroups,
		onDefaultChange,
		onEstimatorTypeChange,
		onEstimatorsCheckboxChange,
		estimatorShortDescription,
		confidenceInterval,
		onConfidenceIntervalsChange,
	])
}
