/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ActionButtonsProps } from '@showwhy/components'
import type { Handler } from '@showwhy/types'

export interface TableProps {
	styles?: React.CSSProperties
	isSticky?: boolean
	isVisible?: boolean
	isSortable?: boolean
	customColumnsWidth?: { fieldName: string; width: string }[]
}

export interface TableFooter {
	data: any
	props?: TableProps
	onClick?: Handler
}

export interface Item {
	onClick?: Handler
	ref?: any
	colsSpan?: number
	actions?: ActionButtonsProps
	[key: string]: any
}

export interface HeaderData {
	value: string | React.ReactNode
	fieldName: string
	iconName?: string
	width?: string
}

export interface TableHeader {
	data: HeaderData[]
	props?: TableProps
}
