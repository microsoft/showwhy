/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { HeaderData } from './HeaderData'
import { TableProps } from './TableProps'

export interface TableHeader {
	data: HeaderData[]
	props?: TableProps
}
