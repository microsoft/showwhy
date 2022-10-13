/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface ListFilterProps {
	list: Array<any>
	filterHandler: Function
	placeholder?: string
	filter?: string
	children: React.ReactElement
}
