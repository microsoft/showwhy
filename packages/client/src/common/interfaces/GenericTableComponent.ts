/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ActionButtonsProps } from './ActionButtons'
import { GenericFn, GenericObject } from '~types'

export interface Item extends GenericObject {
	onClick?: GenericFn
	ref?: any
	colsSpan?: number
	actions?: ActionButtonsProps
}

export interface TableProps {
	styles?: React.CSSProperties
	isSticky?: boolean
	isVisible?: boolean
	isSortable?: boolean
	customColumnsWidth?: { fieldName: string; width: string }[]
}

export interface HeaderData {
	value: string | React.ReactNode
	fieldName: string
	iconName?: string
}

export interface TableHeader {
	data: HeaderData[]
	props?: TableProps
}

export interface TableFooter {
	data: any
	props?: TableProps
	onClick?: GenericFn
}
