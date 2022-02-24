/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import type { DataListenerHandler, View } from 'vega'

// eslint-disable-next-line
export function useData(view: View, data: { [key: string]: any }): void {
	useEffect(() => {
		Object.entries(data).forEach(([name, value]) => {
			view.data(name, value)
		})
	}, [view, data])
}

export function useDataListeners(
	view: View,
	listeners: { [key: string]: DataListenerHandler },
): void {
	useEffect(() => {
		Object.entries(listeners).forEach(([name, value]) => {
			view.addDataListener(name, value)
		})
		return () => {
			if (view) {
				Object.entries(listeners).forEach(([name, value]) => {
					view.removeDataListener(name, value)
				})
			}
		}
	}, [view, listeners])
}
