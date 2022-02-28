/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Handler } from '@showwhy/types'
import type { TableProps } from './TableProps'

export interface TableFooter {
	data: any
	props?: TableProps
	onClick?: Handler
}
