/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import Editor from '@monaco-editor/react'
import { useDebounceFn } from 'ahooks'
import { memo } from 'react'

import type { JsonEditorProps } from './JsonEditor.types.js'

export const JsonEditor: React.FC<JsonEditorProps> = memo(function JsonEditor({
	content,
	onChange,
}) {
	const { run: handleEditorChange } = useDebounceFn(onChange, { wait: 1000 })

	return (
		<Editor
			height="90vh"
			defaultLanguage="json"
			defaultValue={content}
			value={content}
			onChange={handleEditorChange}
		/>
	)
})
