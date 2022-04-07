/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface RadioButtonChoice {
	key: string
	title: string
	description?: string
	isSelected?: boolean
	onChange: (option?: RadioButtonChoice) => void
}
