/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import isArray from 'lodash-es/isArray.js'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { DECIParams } from '../domain/Algorithms/DECI.js'

export function useOnChangeNumberOption(
	onSetDeciParams: SetterOrUpdater<DECIParams>,
): (key: keyof DECIParams, val?: string, name?: string) => void | undefined {
	return useCallback(
		(key: keyof DECIParams, val?: string, name?: string) => {
			if (!val || !name) return
			onSetDeciParams(curr => ({
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
	onSetDeciParams: SetterOrUpdater<DECIParams>,
): (key: keyof DECIParams, val?: boolean, name?: string) => void | undefined {
	return useCallback(
		(key: keyof DECIParams, val?: boolean, name?: string) => {
			if (!name) return
			onSetDeciParams(curr => ({
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
	onSetDeciParams: SetterOrUpdater<DECIParams>,
): (key: keyof DECIParams, val?: string, name?: string) => void | undefined {
	return useCallback(
		(key: keyof DECIParams, val?: string, name?: string) => {
			if (!name || !val) return
			onSetDeciParams(curr => ({
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
	onSetDeciParams: SetterOrUpdater<DECIParams>,
): (key: keyof DECIParams, val?: string, name?: string) => void | undefined {
	return useCallback(
		(key: keyof DECIParams, val?: string, name?: string) => {
			if (!name || !val) return
			onSetDeciParams(curr => ({
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
	onSetDeciParams: SetterOrUpdater<DECIParams>,
): (val?: string) => void {
	return useCallback(
		(val?: string) => {
			const value =
				val && isArray(val)
					? val?.split(',').map(v => +v)
					: val
					? +val
					: undefined

			onSetDeciParams(curr => ({
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
