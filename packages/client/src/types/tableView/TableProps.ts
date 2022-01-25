/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface TableProps {
	styles?: React.CSSProperties
	isSticky?: boolean
	isVisible?: boolean
	isSortable?: boolean
	customColumnsWidth?: { fieldName: string; width: string }[]
}
