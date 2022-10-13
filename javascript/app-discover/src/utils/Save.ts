/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { saveAs } from 'file-saver'

export function saveObjectJSON(
	filename: string,
	persistedInfo: object,
	error: Error | undefined,
) {
	let allPersistedInfo = persistedInfo
	if (error) {
		const { message, stack } = error
		allPersistedInfo = { ...persistedInfo, message, stack }
	}

	const persistedInfoAsString = JSON.stringify(allPersistedInfo)
	const blobState = new Blob([persistedInfoAsString], {
		type: 'application/json',
	})
	saveAs(blobState, filename ? `${filename}.json` : 'export.json')
}
