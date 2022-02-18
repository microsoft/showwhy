/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Specification } from '@data-wrangling-components/core'
import {
	atom,
	Resetter,
	SetterOrUpdater,
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

//step doesn't have an id. What is the identifier
// export function useSetOrUpdateStepsOutputTablePrep(): (
// 	step: Step,
// ) => void {
// 	const useSetStepsOutputTablePrep = useSetRecoilState(stepsOutputTablePrepState)
// 	return useCallback(
// 		(step: Step) => {
// 			useSetStepsOutputTablePrep(prev => {
// 				const exists = prev.find(i => i.id === Step.id)
// 				return !exists
// 					? [...prev, Step]
// 					: [
// 							...prev.filter(i => i.id !== Step.id),
// 							Step,
// 					  ]
// 			})
// 		},
// 		[useSetStepsOutputTablePrep],
// 	)
// }

export function useResetTablesPrepSpecification(): Resetter {
	return useResetRecoilState(stepsTablesPrepSpecification)
}
