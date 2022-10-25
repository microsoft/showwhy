/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import { useMemo } from 'react'

import { useDataTables } from './useDataTables.js'

export function useDatasetMenuItems(
	selected: string | undefined,
	onClick: (tableName: string) => void,
): ICommandBarItemProps {
	const tables = useDataTables()
	const subMenuProps = useMemo(
		() => ({
			items: tables.length
				? tables.map(dataPackage => ({
						key: dataPackage.name,
						text: dataPackage.name,
						onClick: () => onClick(dataPackage.name),
				  }))
				: [],
		}),
		[tables, onClick],
	)
	return useMemo(
		() => ({
			key: 'dataset',
			text: selected ?? 'Dataset',
			subMenuProps: subMenuProps,
		}),
		[selected, subMenuProps],
	)
}
