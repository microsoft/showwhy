/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export const SESSION_ID_KEY = 'sessionId'

export function getStorageItem(key: string): string | null {
	return sessionStorage.getItem(key)
}

export function setStorageItem(key: string, value: string): void {
	sessionStorage.setItem(key, value)
}
