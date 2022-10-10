/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useInterval } from '@essex/hooks'
import { useMemo, useState } from 'react'

import type { Maybe } from '../types/primitives.js'
import { elapsedTime } from './ProgressBar.utils.js'

export function useTimeElapsed(startTime: Maybe<Date>): string {
	const [date, setDate] = useState(new Date())
	useInterval(() => setDate(new Date()), 1000)

	return useMemo(() => {
		if (startTime) {
			return elapsedTime(new Date(startTime), date)
		}
		return '0min 00s'
	}, [date, startTime])
}
