/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowObject } from '@datashaper/core'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const stepsTablesPrepSpecification = atom<WorkflowObject[]>({
	key: 'tables-prep-spec',
	default: [],
})

export function useTablesPrepSpecification(): WorkflowObject[] {
	return useRecoilValue(stepsTablesPrepSpecification)
}

export function useSetTablesPrepSpecification(): SetterOrUpdater<
	WorkflowObject[]
> {
	return useSetRecoilState(stepsTablesPrepSpecification)
}

export function useResetTablesPrepSpecification(): Resetter {
	return useResetRecoilState(stepsTablesPrepSpecification)
}
