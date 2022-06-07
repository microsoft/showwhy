/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

import {
	useSetConfounderThreshold,
	useSetCovariateProportionThreshold,
} from '~state'

import {
	COVARIATE_BALANCE_MAX,
	COVARIATE_BALANCE_MIN,
	COVARIATE_BALANCE_SUFFIX,
} from '../SelectCausalEstimatorsPage.constants'

export function useOnThresholdIncrement(): (
	currentValue: number,
	count?: string,
) => void {
	return useCallback((currentValue: number, count = '1') => {
		const numericValue = getNumericPart(count, currentValue)
		return (
			Math.min(numericValue + 1, COVARIATE_BALANCE_MAX) +
			COVARIATE_BALANCE_SUFFIX
		)
	}, [])
}

export function useOnThresholdDecrement(): (
	currentValue: number,
	count?: string,
) => void {
	return useCallback((currentValue: number, count = '1') => {
		const numericValue = getNumericPart(count, currentValue)
		return (
			Math.max(numericValue - 1, COVARIATE_BALANCE_MIN) +
			COVARIATE_BALANCE_SUFFIX
		)
	}, [])
}

export function useOnConfounderThresholdChange(
	currentValue: number,
): (_: any, count?: string) => void {
	const setConfounderThreshold = useSetConfounderThreshold()

	return useCallback(
		(_: any, count = '1') => {
			const numericValue = getNumericPart(count, currentValue)
			setConfounderThreshold(numericValue)
		},
		[setConfounderThreshold, currentValue],
	)
}
export function useOnProportionThresholdChange(
	currentValue: number,
): (_: any, count?: string) => void {
	const setCovariateProportionThreshold = useSetCovariateProportionThreshold()

	return useCallback(
		(_: any, count = '1') => {
			const numericValue = getNumericPart(count, currentValue)
			setCovariateProportionThreshold(numericValue)
		},
		[setCovariateProportionThreshold, currentValue],
	)
}

const getNumericPart = (value: string, defaultValue: number): number => {
	const valueRegex = /^(\d+(\.\d+)?).*/
	if (valueRegex.test(value)) {
		const numericValue = Number(value.replace(valueRegex, '$1'))
		return isNaN(numericValue) ? defaultValue : numericValue
	}
	return defaultValue
}
