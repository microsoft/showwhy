/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	RawTable,
	RawTableDefaultFeatures,
	useDataTableSource,
} from '@showwhy/app-common'
import { memo, useState } from 'react'

import { JsonEditor } from './JsonEditor.js'
import { useContent, useOnChange } from './RawTableViewer.hooks.js'
import { Container, TableContainer } from './RawTableViewer.styles.js'
import type { RawTableViewerProps } from './RawTableViewer.types.js'
import { ViewOptions } from './ViewOptions.js'
import { ViewType } from './ViewOptions.types.js'

export const RawTableViewer: React.FC<RawTableViewerProps> = memo(
	function RawTableViewer({ dataTable }) {
		const table = useDataTableSource(dataTable)
		const [viewType, setViewType] = useState(ViewType.Interactive)
		const onChange = useOnChange(dataTable)
		const content = useContent(dataTable)

		return (
			<Container>
				<ViewOptions selected={viewType} onChange={setViewType} />
				{dataTable && table && (
					<TableContainer>
						{viewType === ViewType.Interactive ? (
							<RawTable features={RawTableDefaultFeatures} table={table} />
						) : (
							<JsonEditor content={content} onChange={onChange} />
						)}
					</TableContainer>
				)}
			</Container>
		)
	},
)
