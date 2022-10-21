/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function sleep(ms: number): Promise<boolean> {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true)
		}, ms)
	})
}
