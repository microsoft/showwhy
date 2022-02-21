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
	outputViewTable?: ColumnTable
	outputTable?: ColumnTable
	handleTransformRequested: (step: any) => Promise<void>
	variables: VariableDefinition[]
}
