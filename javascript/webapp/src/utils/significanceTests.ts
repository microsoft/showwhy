/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SignificanceTest } from '@showwhy/types'
import type { SetterOrUpdater } from 'recoil'

export function updateSignificanceTests(
	setSignificanceTest: SetterOrUpdater<SignificanceTest[]>,
	runId?: string,
	outcome?: string,
	significanceTest?: SignificanceTest,
): void {
	setSignificanceTest(prev => {
		const oldOnes = prev.filter(p => p.runId !== runId || p.outcome !== outcome)
		if (!significanceTest) return oldOnes

		const existing = prev.find(
			p => p.runId === significanceTest.runId && p.outcome === outcome,
		) as SignificanceTest

		const newOne = {
			...existing,
			...significanceTest,
		}
		return [...oldOnes, newOne] as SignificanceTest[]
	})
}
