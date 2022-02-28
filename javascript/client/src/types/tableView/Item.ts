/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Handler } from '@showwhy/types'
import type { ActionButtonsProps } from '~components/ActionButtons'

export interface Item {
	onClick?: Handler
	ref?: any
	colsSpan?: number
	actions?: ActionButtonsProps
	[key: string]: any
}
