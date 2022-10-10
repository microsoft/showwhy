/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'

import type { SignificanceTestStatus } from '../types/api/SignificanceTestStatus.js'

export function updateSignificanceTests(
	setSignificanceTest: SetterOrUpdater<SignificanceTestStatus[]>,
	runId?: string,
	outcome?: string,
	significanceTest?: Partial<SignificanceTestStatus>,
): void {
	setSignificanceTest(prev => {
		const oldOnes = prev.filter(
			p => p.taskId !== runId || p.outcome !== outcome,
		)
		if (!significanceTest) return oldOnes

		const existing = prev.find(
			p => p.taskId === significanceTest.taskId && p.outcome === outcome,
		) as SignificanceTestStatus

		const newOne = {
			...existing,
			...significanceTest,
		}
		return [...oldOnes, newOne] as SignificanceTestStatus[]
	})
}
