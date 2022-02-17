/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const stepsTablesPrepState = atom<Step[]>({
	key: 'steps-tables-prep',
	default: [],
})

export function useStepsTablePrep(): Step[] {
	return useRecoilValue(stepsTablesPrepState)
}

export function useSetStepsTablePrep(): SetterOrUpdater<Step[]> {
	return useSetRecoilState(stepsTablesPrepState)
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

export function useResetStepTablePrep(): Resetter {
	return useResetRecoilState(stepsTablesPrepState)
}
