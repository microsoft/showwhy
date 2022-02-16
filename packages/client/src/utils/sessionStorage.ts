/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function getStorageItem(key: string): string | null {
	return sessionStorage.getItem(key)
}

export function setStorageItem(key: string, value: string): void {
	sessionStorage.setItem(key, value)
}

export function createAndReturnStorageItem(key: string, value: string): string {
	sessionStorage.setItem(key, value)
	return value
}

export function removeStorageItem(key: string): void {
	sessionStorage.removeItem(key)
}
