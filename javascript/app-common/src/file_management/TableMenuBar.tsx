/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'

import { useDatasetMenuItems } from '../hooks/useDatasetMenuItems.js'
import { useTableMenuBarStyles } from './TableMenuBar.styles.js'
import type { TableMenuBarProps } from './TableMenuBar.types.js'

export const TableMenuBar: React.FC<TableMenuBarProps> = memo(function MenuBar({
	selectedTable,
	onTableSelected,
}) {
	const handleClick = useCallback(
		(datasetId: string) => onTableSelected?.(datasetId),
		[onTableSelected],
	)
	const datasetMenuItems = useDatasetMenuItems(selectedTable, handleClick)
	const menuItems = useMemo<ICommandBarItemProps[]>(
		() => [datasetMenuItems],
		[datasetMenuItems],
	)
	const styles = useTableMenuBarStyles()
	return <CommandBar items={menuItems} styles={styles} />
})
