/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'
import { CommonLayout, useDataTable } from '@showwhy/app-common'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { WrangleContent } from './WrangleContent.js'
import { useSelectedResource, useSelectedTable } from './WrangleData.hooks.js'

export const WrangleData = memo(function CauseDis() {
	// TODO: the selected table/resource should probable be a single hook
	const selectedTableName = useSelectedTable()
	const selectedResource = useSelectedResource()
	const selectedTable = useDataTable(selectedTableName)

	return (
		<CommonLayout>
			<WrangleDataContainer>
				<WrangleContent dataTable={selectedTable} resource={selectedResource} />
			</WrangleDataContainer>
		</CommonLayout>
	)
})

const WrangleDataContainer = styled.div`
	height: calc(100vh - 40px);
`
