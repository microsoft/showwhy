/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { View } from 'vega'
import { LogLevel } from '../types'

export function useLogLevel(view: View, logLevel: LogLevel): void {
	useEffect(() => {
		view.logLevel(logLevel)
	}, [view, logLevel])
}
