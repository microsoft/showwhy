/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface PivotData {
	key: string
	title: string
	label: string
	description: string
	//eslint-disable-next-line
	items: Record<string, any>[]
}
