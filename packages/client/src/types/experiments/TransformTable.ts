/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ICommandBarItemProps } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { VariableDefinition } from '~types'

export interface TransformTable {
	commands: ICommandBarItemProps[]
	isModalOpen: boolean
	hideModal: () => void
	viewTable?: ColumnTable
	originalTable?: ColumnTable
	handleTransformRequested: (step: any) => Promise<void>
	variables: VariableDefinition[]
}
