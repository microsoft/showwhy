/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Try to parse json and return javascript object if successful. Return undefined if provided string isn't a valid json
 * @param body json string
 */
export const parseJSON = <T>(body: string): T | undefined => {
	try {
		return JSON.parse(body) as T
	} catch (e) {
		return
	}
}
