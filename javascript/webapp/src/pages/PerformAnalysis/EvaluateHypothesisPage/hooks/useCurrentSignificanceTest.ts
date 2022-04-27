/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe, SignificanceTest } from '@showwhy/types'
import { useMemo } from 'react'

import { useDefaultRun } from '~hooks'
import { useSignificanceTest } from '~state'

export function useCurrentSignificanceTest(
	selectedOutcome: string,
): Maybe<SignificanceTest> {
	const defaultRun = useDefaultRun()
	const significanceTest = useSignificanceTest()

	return useMemo(() => {
		if (!defaultRun) return undefined
		return significanceTest.find(
			x => x.runId === defaultRun.id && x.outcome === selectedOutcome,
		)
	}, [defaultRun, significanceTest, selectedOutcome])
}
