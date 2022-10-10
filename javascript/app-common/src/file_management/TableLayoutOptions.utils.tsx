/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataOrientation } from '@datashaper/schema'

export const DATA_LAYOUT_OPTIONS = Object.keys(DataOrientation).map(d => {
	return {
		key: d.toLowerCase(),
		text: d.toLowerCase() === DataOrientation.Records ? 'Rows' : d,
	}
})
