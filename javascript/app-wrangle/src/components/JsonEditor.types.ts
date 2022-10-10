/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface JsonEditorProps {
	content: string
	onChange: (content: string | undefined) => void
}
