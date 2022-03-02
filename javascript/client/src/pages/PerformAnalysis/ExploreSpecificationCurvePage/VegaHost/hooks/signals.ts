/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import type { SignalListenerHandler, SignalValue, View } from 'vega'

export function useSignals(
	view: View,
	signals: { [key: string]: SignalValue },
): void {
	useEffect(() => {
		Object.entries(signals).forEach(([name, value]) => {
			view.signal(name, value)
		})
	}, [view, signals])
}

export function useSignalListeners(
	view: View,
	listeners: { [key: string]: SignalListenerHandler },
): void {
	useEffect(() => {
		Object.entries(listeners).forEach(([name, value]) => {
			view.addSignalListener(name, value)
		})
		return () => {
			if (view) {
				Object.entries(listeners).forEach(([name, value]) => {
					view.removeSignalListener(name, value)
				})
			}
		}
	}, [view, listeners])
}
