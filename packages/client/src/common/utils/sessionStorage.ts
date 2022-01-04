/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export const getStorageItem = (key: string): string | null => {
	return sessionStorage.getItem(key)
}
export const setStorageItem = (key: string, value: string): void => {
	sessionStorage.setItem(key, value)
}

export const createAndReturnStorageItem = (
	key: string,
	value: string,
): string => {
	sessionStorage.setItem(key, value)
	return value
}

export const removeStorageItem = (key: string): void => {
	sessionStorage.removeItem(key)
}
