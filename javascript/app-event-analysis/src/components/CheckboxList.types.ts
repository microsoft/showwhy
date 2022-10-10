/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface Item {
	name: string
}

export interface CheckboxListProps {
	items: Item[]
	selection: Set<string>
	onSelectionChange: (selection: Set<string>) => void
	height: number | string
}

export interface RenderItem {
	name: string
	checked: boolean
}
