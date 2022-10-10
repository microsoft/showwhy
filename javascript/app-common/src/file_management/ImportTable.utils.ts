/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFormat } from '@datashaper/schema'

export const DATA_FORMAT_OPTIONS = Object.keys(DataFormat).map(d => {
	return {
		key: d.toLowerCase(),
		text: d,
	}
})
