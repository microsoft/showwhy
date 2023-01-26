/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

const ResolveTypescriptPlugin = require('resolve-typescript-plugin')

module.exports = {
	stories: ['../../*/src/**/*.stories.@(mdx|js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-links',
		'@storybook/addon-interactions',
	],
	framework: '@storybook/react',
	webpackFinal: async (config) => {
		if (!config.resolve) {
			config.resolve = {}
		}
		if (!config.resolve.plugins) {
			config.resolve.plugins = []
		}
		config.resolve.plugins.push(new ResolveTypescriptPlugin())

		if (!config.resolve.alias) {
			config.resolve.alias = {}
		}
		config.resolve.alias['styled-components'] =
			require.resolve('styled-components')
		config.resolve.alias['hsluv'] = require.resolve('hsluv')

		// run transpiler over monorepo linked projects
		const xformDwc = {
			...config.module.rules[0],
			include: /@datashaper/,
			exclude: undefined,
		}
		const xformEssex = {
			...config.module.rules[0],
			include: /@essex/,
			exclude: undefined,
		}
		const xformFetchBlob = {
			...config.module.rules[0],
			include: /fetch-blob/,
			exclude: undefined,
		}
		const importMeta = {
			test: /\.js$/,
			loader: require.resolve('@open-wc/webpack-import-meta-loader'),
		}
		config.module.rules.push(xformDwc, xformEssex, xformFetchBlob, importMeta)
		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules/,
			type: 'javascript/auto',
		})

		return config
	},
}
