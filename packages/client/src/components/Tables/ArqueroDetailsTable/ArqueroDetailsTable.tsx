/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroDetailsListProps,
} from '@data-wrangling-components/react'
import { memo } from 'react'

export const ArqueroDetailsTable: React.FC<ArqueroDetailsListProps> = memo(
	function ArqueroDetailsTable(props) {
		return (
			<ArqueroDetailsList
				isSortable
				isHeadersFixed
				isStriped
				showColumnBorders
				{...props}
			/>
		)
	},
)
