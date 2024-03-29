/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

export type onChangeStringInObjectFn = (
	val?: string | undefined,
	name?: string | undefined,
) => void | undefined

export function useOnChangeNumberInObject<T>(
	onSetParams: SetterOrUpdater<T>,
): onChangeStringInObjectFn {
	return useCallback(
		(val?: string, name?: string) => {
			if (!(val && name)) return
			onSetParams((curr) => ({
				...curr,
				[name]: +val,
			}))
		},
		[onSetParams],
	)
}

export function useOnChangeStringInObject<T>(
	onSetParams: SetterOrUpdater<T>,
): onChangeStringInObjectFn {
	return useCallback(
		(val?: string, name?: string) => {
			if (!(val && name)) return
			onSetParams((curr) => ({
				...curr,
				[name]: val,
			}))
		},
		[onSetParams],
	)
}

export function useAllowEmptyValidation(): (value: string) => string | void {
	return useCallback((value: string) => {
		if (value.trim() === '') {
			return ''
		}
		const n = +value

		if (isNaN(n)) {
			return
		}
		return value
	}, [])
}

export function spinValueToNumber(
	newValue: string | undefined,
): number | undefined {
	if (newValue !== undefined && newValue !== '') {
		return +newValue
	}
	return
}
