/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { Step } from '@data-wrangling-components/core'

export const stepsOutputTablePrepState = atom<Step[]>({
	key: 'output-table-prep',
	default: [],
})

export function useStepsOutputTablePrep(): Step[] {
	return useRecoilValue(stepsOutputTablePrepState)
}

export function useSetStepsOutputTablePrep(): SetterOrUpdater<Step[]> {
	return useSetRecoilState(stepsOutputTablePrepState)
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

export function useResetStepsOutputTablePrep(): Resetter {
	return useResetRecoilState(stepsOutputTablePrepState)
}
