/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	atomFamily,
	SetterOrUpdater,
	useRecoilTransaction_UNSTABLE,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'
import { StepStatus, Maybe } from '~types'

export const stepStatusState = atomFamily<
	StepStatus | undefined,
	Maybe<string>
>({
	key: 'step-status-store',
	default: undefined,
})

export function useSetStepStatus(
	key: Maybe<string>,
): SetterOrUpdater<StepStatus | undefined> {
	return useSetRecoilState(stepStatusState(key))
}

export function useStepStatus(key: Maybe<string>): StepStatus | undefined {
	return useRecoilValue(stepStatusState(key))
}

/**
 * Sets a list of step page statuses to the provided status
 * Note that they all get set to the same status - this is convenient
 * for setting a list all to Done or ToDo at the same time, for example
 * @returns callback that takes a list of step page ids and the status to set for all of them
 */
export function useSetStepStatuses(): (
	urls: string[],
	status: StepStatus,
) => void {
	return useRecoilTransaction_UNSTABLE(
		({ set }) =>
			(urls: string[], status: StepStatus) => {
				urls.forEach(url => {
					set(stepStatusState(url), status)
				})
			},
		[],
	)
}
