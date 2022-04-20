/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SignificanceTest } from '@showwhy/types'
import type { SetterOrUpdater } from 'recoil'

export function updateSignificanceTests(
	setSignificanceTest: SetterOrUpdater<SignificanceTest[]>,
	runId?: string,
	significanceTest?: SignificanceTest,
): void {
	setSignificanceTest(prev => {
		const oldOnes = prev.filter(p => p.runId !== runId)
		if (!significanceTest) return oldOnes

		const existing = prev.find(
			p => p.runId === significanceTest.runId,
		) as SignificanceTest

		const newOne = {
			...existing,
			...significanceTest,
		}
		return [...oldOnes, newOne] as SignificanceTest[]
	})
}
