/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { Handler, Maybe } from '~types'

export interface SharedModelVariableLogic {
	showConfirmDelete: boolean
	toggleShowConfirmDelete: Handler
	outputTablePrep: Maybe<ColumnTable>
	subjectIdentifier: Maybe<string>
}
