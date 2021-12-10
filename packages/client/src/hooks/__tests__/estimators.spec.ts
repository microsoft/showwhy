/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { jest } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { EstimatorsType, EstimatorsGroups } from '../../common/enums'
import { useEstimators } from '../../state'
import {
	ESTIMATORS_SHORT_DESCRIPTION,
	useEstimatorShortDescription,
	useExposureEstimatorsList,
	EXPOSURE_ESTIMATORS,
	useOutcomeEstimatorsList,
	OUTCOME_ESTIMATORS,
	useEstimatorsList,
	ESTIMATORS,
	useEstimatorHelpText,
	ESTIMATORS_LEARN_MORE_INFO,
	useForestDoublyRobustLearner,
	useLinearDoublyRobustLearner,
	useExposureAssignedEstimators,
	useOutcomeBasedEstimators,
} from '../estimators'

const useEstimatorsListenerMock = useEstimators as jest.MockedFunction<
	typeof useEstimators
>

describe('estimatorsHooks', () => {
	it('useForestDoublyRobustLearner', () => {
		const expected = ESTIMATORS.find(
			e => e.type === EstimatorsType.ForestDoublyRobustLearner,
		)
		const { result } = renderHook(
			() => useForestDoublyRobustLearner([expected]),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		expect(response.pop()).toEqual(expected)
	})

	it('useLinearDoublyRobustLearner', () => {
		const expected = ESTIMATORS.find(
			e => e.type === EstimatorsType.LinearDoublyRobustLearner,
		)
		const { result } = renderHook(
			() => useLinearDoublyRobustLearner([expected]),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		expect(response.pop()).toEqual(expected)
	})

	it('useExposureAssignedEstimators', () => {
		const expected = ESTIMATORS.find(
			e => e.type === EstimatorsType.InversePropensityWeighting,
		)
		const { result } = renderHook(
			() => useExposureAssignedEstimators([expected]),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		expect(response.pop()).toEqual(expected)
	})

	it('useOutcomeBasedEstimators', () => {
		const expected = ESTIMATORS.find(
			e => e.type === EstimatorsType.LinearRegression,
		)
		const { result } = renderHook(() => useOutcomeBasedEstimators([expected]), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		expect(response.pop()).toEqual(expected)
	})

	it('useExposureEstimatorsList', () => {
		const expected = EXPOSURE_ESTIMATORS
		const { result } = renderHook(() => useExposureEstimatorsList())
		const response = result.current
		expect(response).toEqual(expected)
	})

	it('useOutcomeEstimatorsList', () => {
		const expected = OUTCOME_ESTIMATORS
		const { result } = renderHook(() => useOutcomeEstimatorsList())
		const response = result.current
		expect(response).toEqual(expected)
	})

	it('useEstimatorsList', () => {
		const expected = ESTIMATORS
		const { result } = renderHook(() => useEstimatorsList())
		const response = result.current
		expect(response).toEqual(expected)
	})

	it('useEstimatorHelpText', () => {
		const expected = ESTIMATORS_LEARN_MORE_INFO.exposure
		const { result } = renderHook(() => useEstimatorHelpText())
		const response = result.current(EstimatorsGroups.ExposureEstimator)
		expect(response).toEqual(expected)
	})

	it('useEstimatorShortDescription', () => {
		const expected = ESTIMATORS_SHORT_DESCRIPTION.exposure
		const { result } = renderHook(() => useEstimatorShortDescription())
		const response = result.current(EstimatorsGroups.ExposureEstimator)
		expect(response).toEqual(expected)
	})
})
