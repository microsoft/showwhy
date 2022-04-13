/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ActionButtonsProps } from '@showwhy/components'
import type { Handler } from '@showwhy/types'

export interface Item {
	onClick?: Handler
	ref?: any
	colsSpan?: number
	actions?: ActionButtonsProps
	[key: string]: any
}
