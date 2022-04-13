/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Specification } from '@data-wrangling-components/core'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const stepsTablesPrepSpecification = atom<Specification[]>({
	key: 'tables-prep-spec',
	default: [],
})

export function useTablesPrepSpecification(): Specification[] {
	return useRecoilValue(stepsTablesPrepSpecification)
}

export function useSetTablesPrepSpecification(): SetterOrUpdater<
	Specification[]
> {
	return useSetRecoilState(stepsTablesPrepSpecification)
}

export function useResetTablesPrepSpecification(): Resetter {
	return useResetRecoilState(stepsTablesPrepSpecification)
}
