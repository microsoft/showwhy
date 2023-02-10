/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export const SESSION_ID_KEY = 'sessionId'

export function getStorageItem(key: string): any | null {
	try {
		return JSON.parse(sessionStorage.getItem(key) as string)
	} catch {
		return null
	}
}

export function setStorageItem(key: string, value: string): void {
	sessionStorage.setItem(key, value)
}

export function removeStorageItem(key: string): void {
	sessionStorage.removeItem(key)
}

export function clearStorage(): void {
	sessionStorage.clear()
}
