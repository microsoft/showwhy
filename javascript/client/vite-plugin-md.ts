/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Plugin } from 'vite'

async function tf(code, id) {
	await Promise.resolve()
	if (!id.endsWith('.md')) return null
	// eslint-disable-next-line
	return 'export default `' + `${code}` + '`'
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
