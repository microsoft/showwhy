/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'

import { useContent, useOnChange } from './DataSourceEditor.hooks.js'
import type { DataSourceEditorProps } from './DataSourceEditor.types.js'
import { JsonEditor } from './JsonEditor.js'
import { ParserOptionsEditor } from './ParserOptionsEditor.js'
import { ViewOptions } from './ViewOptions.js'
import { ViewType } from './ViewOptions.types.js'

export const DataSourceEditor: React.FC<DataSourceEditorProps> = memo(
	function DataSourceEditor({ dataTable }) {
		const [viewType, setViewType] = useState(ViewType.Interactive)
		const content = useContent(dataTable)
		const onChange = useOnChange(dataTable)

		return (
			<>
				<ViewOptions selected={viewType} onChange={setViewType} />
				{viewType === ViewType.Interactive ? (
					<ParserOptionsEditor dataTable={dataTable} />
				) : (
					<JsonEditor content={content} onChange={onChange} />
				)}
			</>
		)
	},
)
