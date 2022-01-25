/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { TableDerivationType } from './TableDerivationType'

export interface TableDerivation {
	id: string
	column: string
	columnName: string
	threshold: number
	type: TableDerivationType
}
