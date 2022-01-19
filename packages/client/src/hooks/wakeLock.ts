/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect } from 'react'

export function useWakeLock(): void {
	return useEffect(() => {
		/**
		 * WakeLock won't work on Firefox nor Safari
		 * https://caniuse.com/mdn-api_wakelock
		 */
		if (!('wakeLock' in navigator)) return

		let wakeLock
		const requestWakeLock = async () => {
			try {
				wakeLock = await navigator['wakeLock'].request('screen')
				/**
				 * Release event listener, gets executed when the page/tab is changed or minimized
				 */
			} catch (err: any) {
				console.log(`Wake Lock request failed: ${err.name}, ${err.message}`)
			}
		}
		/**
		 * Request the wake lock on mount
		 */
		requestWakeLock()

		/**
		 * Request WakeLock when page is visible again
		 */
		document.addEventListener('visibilitychange', async () => {
			if (document.visibilityState === 'visible') {
				requestWakeLock()
			}
		})

		/**
		 * Release WakeLock on unmount
		 */
		return () => {
			wakeLock?.release().then(() => {
				wakeLock = null
			})
		}
	}, [])
}
