/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'
import type { ICommandBarItemProps } from '@fluentui/react'
import { useMemo } from 'react'

export function useDatasetMenuItems(
	dataTable: DataTable[],
	itemClicked: (tableName: string) => void,
): ICommandBarItemProps {
	const subMenuProps = useMemo(
		() => ({
			items: dataTable.length
				? dataTable.map(dataPackage => ({
						key: dataPackage.name,
						text: dataPackage.name,
						onClick: () => itemClicked(dataPackage.name),
				  }))
				: [],
		}),
		[dataTable, itemClicked],
	)
	return useMemo(
		() => ({
			key: 'dataset',
			text: 'Dataset',
			subMenuProps: subMenuProps,
		}),
		[subMenuProps],
	)
}
