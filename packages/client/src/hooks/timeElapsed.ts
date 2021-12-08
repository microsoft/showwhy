/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useInterval } from '@essex-js-toolkit/hooks'
import { useState, useMemo } from 'react'
import { returnElapsedTime } from '~utils'

export function useTimeElapsed(startTime: Date | undefined): string {
	const [date, setDate] = useState(new Date())
	useInterval(() => setDate(new Date()), 1000)

	return useMemo(() => {
		if (startTime) {
			return returnElapsedTime(new Date(startTime), date)
		}
		return '0min 00s'
	}, [date, startTime])
}
