/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsListProps } from '@fluentui/react'
import {
	DetailsList as FUIDetailsList,
	DetailsListLayoutMode,
	SelectionMode,
} from '@fluentui/react'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import type { Header } from './DetailsList.types'
import { getColumns, onRenderField, onRenderRow } from './DetailsList.util.js'

interface Props extends Omit<IDetailsListProps, 'columns'> {
	headers: Header[]
}
export const DetailsList: FC<Props> = memo(function DetailsList({
	items,
	headers,
	compact = true,
	layoutMode = DetailsListLayoutMode.justified,
	selectionMode = SelectionMode.none,
	...props
}) {
	const columns = getColumns(headers)
	return (
		<Container>
			<FUIDetailsList
				compact={compact}
				selectionMode={selectionMode}
				layoutMode={layoutMode}
				items={items}
				columns={columns}
				onRenderField={onRenderField}
				onRenderRow={onRenderRow}
				styles={{
					contentWrapper: { display: !items.length ? 'none' : 'inherit' },
				}}
				{...props}
			/>
		</Container>
	)
})

const Container = styled.div``
