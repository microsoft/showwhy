/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ArqueroDetailsListProps } from '@data-wrangling-components/react'
import { ArqueroDetailsList } from '@data-wrangling-components/react'
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
