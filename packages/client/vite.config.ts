/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import essexViteConfig from '@essex/vite-config'
import { defineConfig } from 'vite'
import { plugin } from './vite-plugin-md'

// https://vitejs.dev/config/
export default defineConfig({
	...essexViteConfig,
	plugins: [...essexViteConfig.plugins, plugin()],
})
