/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { useDatasetMenuItems } from './MenuBar.hooks.js'
import type { MenuBarProps } from './MenuBar.types.js'

export const MenuBar: React.FC<MenuBarProps> = memo(function MenuBar({
	dataTables,
	onItemClicked,
}) {
	const onMenuitemClicked = (datasetId: string) => {
		if (onItemClicked) {
			onItemClicked(datasetId)
		}
	}

	const datasetMenuItems = useDatasetMenuItems(dataTables, onMenuitemClicked)

	const menuItems = useMemo<ICommandBarItemProps[]>(
		() => [datasetMenuItems],
		[datasetMenuItems],
	)
	return <CommandBar items={menuItems} />
})
