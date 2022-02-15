/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import Frontmatter from 'front-matter'
import { Plugin } from 'vite'

async function tf(code, id) {
	if (!id.endsWith('.md')) return null
	const { body } = Frontmatter<unknown>(code)
	// eslint-disable-next-line
	return 'export default `' + `${body}` + '`'
}

export const plugin = (): Plugin => {
	return {
		name: 'vite-plugin-md',
		enforce: 'pre',
		transform(code, id) {
			return tf(code, id)
		},
	}
}
