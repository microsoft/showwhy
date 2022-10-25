/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface TableMenuBarProps {
	selectedTable: string | undefined
	onTableSelected: (tableName: string) => void
}
