/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import isArray from 'lodash-es/isArray.js'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { DECIAlgorithmParams } from '../domain/Algorithms/DECI.js'
import type { ATEDetails } from '../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { onChangeATEDetailsFn } from './DeciATEDetailsParams.types.js'
import type { onChangeBooleanFn, onChangeStringFn } from './DeciParams.types.js'

export function useOnChangeNumberOption(
	onSetDeciParams: SetterOrUpdater<DECIAlgorithmParams>,
): onChangeStringFn {
	return useCallback(
		(key: keyof DECIAlgorithmParams, val?: string, name?: string) => {
			if (!(val && name)) return
			onSetDeciParams((curr) => ({
				...curr,
				[key]: {
					...curr[key],
					[name]: +val,
				},
			}))
		},
		[onSetDeciParams],
	)
}

export function useOnChangeBooleanOption(
	onSetDeciParams: SetterOrUpdater<DECIAlgorithmParams>,
): onChangeBooleanFn {
	return useCallback(
		(key: keyof DECIAlgorithmParams, val?: boolean, name?: string) => {
			if (!name) return
			onSetDeciParams((curr) => ({
				...curr,
				[key]: {
					...curr[key],
					[name]: val,
				},
			}))
		},
		[onSetDeciParams],
	)
}

export function useOnChangeChoiceGroupOption(
	onSetDeciParams: SetterOrUpdater<DECIAlgorithmParams>,
): onChangeStringFn {
	return useCallback(
		(key: keyof DECIAlgorithmParams, val?: string, name?: string) => {
			if (!(name && val)) return
			onSetDeciParams((curr) => ({
				...curr,
				[key]: {
					...curr[key],
					[name]: val,
				},
			}))
		},
		[onSetDeciParams],
	)
}

export function useOnChangeNumberListOption(
	onSetDeciParams: SetterOrUpdater<DECIAlgorithmParams>,
): onChangeStringFn {
	return useCallback(
		(key: keyof DECIAlgorithmParams, val?: string, name?: string) => {
			if (!(name && val)) return
			onSetDeciParams((curr) => ({
				...curr,
				[key]: {
					...curr[key],
					[name]: val.replaceAll(' ', '').split(','),
				},
			}))
		},
		[onSetDeciParams],
	)
}

export function useOnChangeCateOption(
	onSetDeciParams: SetterOrUpdater<DECIAlgorithmParams>,
): (val?: string) => void {
	return useCallback(
		(val?: string) => {
			const value =
				val && isArray(val)
					? val?.split(',').map((v) => +v)
					: val
					? +val
					: undefined

			onSetDeciParams((curr) => ({
				...curr,
				model_options: {
					...curr.model_options,
					cate_rff_lengthscale: value,
				},
			}))
		},
		[onSetDeciParams],
	)
}

export function useOnChangeATEDetails(
	onSetDeciParams: SetterOrUpdater<DECIAlgorithmParams>,
): onChangeATEDetailsFn {
	return useCallback(
		(variableName: string, details: ATEDetails) => {
			onSetDeciParams((curr) => ({
				...curr,
				ate_options: {
					...curr.ate_options,
					ate_details_by_name: {
						...curr.ate_options?.ate_details_by_name,
						[variableName]: details,
					},
				},
			}))
		},
		[onSetDeciParams],
	)
}
