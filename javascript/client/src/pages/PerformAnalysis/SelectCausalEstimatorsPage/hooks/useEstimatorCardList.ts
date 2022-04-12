/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	Estimator,
	EstimatorGroup,
	EstimatorType,
	Handler,
	Maybe,
} from '@showwhy/types'
import { useMemo } from 'react'

import type { EstimatorCardOption } from '../SelectCausalEstimatorsPage.types'
import { estimatorGroups } from '../SelectCausalEstimatorsPage.types'

export function useEstimatorCardList(
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
): EstimatorCardOption[] {
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
