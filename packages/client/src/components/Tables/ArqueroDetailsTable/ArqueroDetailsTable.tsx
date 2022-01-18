/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroDetailsListProps,
} from '@data-wrangling-components/react'
import React, { memo } from 'react'

export const ArqueroDetailsTable: React.FC<ArqueroDetailsListProps> = memo(
	function ArqueroDetailsTable(props) {
		return (
			<ArqueroDetailsList
				{...props}
				isSortable
				isHeadersFixed
				isStriped
				showColumnBorders
			/>
		)
	},
)
