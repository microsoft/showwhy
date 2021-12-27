/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEstimatorByRanking, estimatorGroups } from './constants'
import { EstimatorsGroups, EstimatorsType } from '~enums'
import { useEstimatorShortDescription, useEstimatorsList } from '~hooks'
import { Estimator } from '~interfaces'
import {
	useSetEstimators,
	useSetPrimarySpecificationConfig,
	usePrimarySpecificationConfig,
	useEstimators,
	useSetConfidenceInterval,
	useToggleConfidenceInterval,
	useConfidenceInterval,
} from '~state'
import { GenericObject } from '~types'

enum BatchUpdateAction {
	Delete = 'delete',
	Add = 'add',
}

export const useEstimatorHook = (): GenericObject => {
	const estimators = useEstimators()
	const setEstimators = useSetEstimators()
	const estimatorsList = useEstimatorsList()
	const estimatorShortDescription = useEstimatorShortDescription()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const setConfidenceInterval = useSetConfidenceInterval()
	const toggleConfidenceInterval = useToggleConfidenceInterval()
	const confidenceInterval = useConfidenceInterval()

	const [selectedEstimatorGroupKey, setSelectedEstimatorGroupKey] =
		useState<EstimatorsGroups>(estimatorGroups[0].key as EstimatorsGroups)
	const [selectedEstimatorGroups, setSelectedEstimatorGroups] = useState<
		EstimatorsGroups[]
	>([])
	const [defaultEstimator, setDefaultEstimator] = useState<
		EstimatorsType | undefined
	>(primarySpecificationConfig.type)

	const onConfidenceIntervalsChange = useCallback(
		(
			ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
			checked?: boolean,
		): void => {
			toggleConfidenceInterval()
		},
		[toggleConfidenceInterval],
	)

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
		setSelectedEstimatorGroupKey,
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
		selectedEstimatorGroupKey,
		onDefaultChange,
		onEstimatorTypeChange,
		onEstimatorsCheckboxChange,
		estimatorShortDescription,
		confidenceInterval,
		onConfidenceIntervalsChange,
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

const useBatchUpdate = setEstimators => {
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

const useVerifyEstimatorGroups = (
	estimatorsList,
	estimators,
	setSelectedEstimatorGroups,
) => {
	return useCallback(() => {
		estimatorGroups.forEach(item => {
			const group: EstimatorsGroups = item.key as EstimatorsGroups
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

const useOnEstimatorTypeChange = (
	estimatorsList,
	selectedEstimatorGroups,
	setSelectedEstimatorGroupKey,
	batchUpdateSelectedEstimators,
	setSelectedEstimatorGroups,
) => {
	return useCallback(
		(group: EstimatorsGroups) => {
			setSelectedEstimatorGroupKey(group)
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
			setSelectedEstimatorGroupKey,
			batchUpdateSelectedEstimators,
			setSelectedEstimatorGroups,
		],
	)
}

const useOnDefaultChange = (
	setDefaultEstimator,
	setPrimarySpecificationConfig,
) => {
	return useCallback(
		(type: EstimatorsType) => {
			setDefaultEstimator(type)
			setPrimarySpecificationConfig(prev => ({
				...prev,
				type,
			}))
		},
		[setDefaultEstimator, setPrimarySpecificationConfig],
	)
}

const useEstimatorCardList = (
	estimatorsList,
	defaultEstimator,
	estimators,
	selectedEstimatorGroups,
	selectedEstimatorGroupKey,
	onDefaultChange,
	onEstimatorTypeChange,
	onEstimatorsCheckboxChange,
	estimatorShortDescription,
	confidenceInterval,
	onConfidenceIntervalsChange,
) => {
	return useMemo(() => {
		const list = estimatorGroups.map(type => {
			const { key } = type
			return {
				key,
				title: `${key} models`,
				description: estimatorShortDescription(key),
				onCardClick: () => onEstimatorTypeChange(key as EstimatorsGroups),
				isCardChecked: selectedEstimatorGroups.includes(
					key as EstimatorsGroups,
				),
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
		selectedEstimatorGroupKey,
		onDefaultChange,
		onEstimatorTypeChange,
		onEstimatorsCheckboxChange,
		estimatorShortDescription,
		confidenceInterval,
		onConfidenceIntervalsChange,
	])
}
