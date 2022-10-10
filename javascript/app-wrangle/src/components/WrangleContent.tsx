/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { CodebookEditor } from './CodebookEditor.js'
import { DataSourceEditor } from './DataSourceEditor.js'
import { RawTableViewer } from './RawTableViewer.js'
import { TableEditor } from './TableEditor.js'
import { WorkflowEditor } from './WorkflowEditor.js'
import type { WrangleContentProps } from './WrangleContent.types.js'

export const WrangleContent: React.FC<WrangleContentProps> = memo(
	function WrangleContent({ dataTable, resource }) {
		if (!dataTable) {
			return null
		}
		switch (resource) {
			case 'datasource': // not modeled in enum
				return <RawTableViewer dataTable={dataTable} />
			case 'workflow':
				return <WorkflowEditor dataTable={dataTable} />
			case 'bundle': // not modeled in enum
				return <TableEditor dataTable={dataTable} />
			case 'source':
				return <DataSourceEditor dataTable={dataTable} />
			case 'codebook':
				return <CodebookEditor dataTable={dataTable} />
			default:
				return <div>unknown resource type {resource}</div>
		}
	},
)
