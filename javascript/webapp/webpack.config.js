/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/webpack-config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const configuration = configure({
	aliases: () => ({
		'@datashaper/app-framework': require.resolve('@datashaper/app-framework'),
		'@showwhy/app-common': require.resolve('@showwhy/app-common'),
		'react-router-dom': require.resolve('react-router-dom'),
	}),
	environment: (env, mode) => {
		return {
			EXPOSURE_API_URL: process.env.EXPOSURE_API_URL ?? '/api/exposure',
			EVENTS_API_URL: process.env.EVENTS_API_URL ?? '/api/events',
			DISCOVER_API_URL: process.env.DISCOVER_API_URL ?? '/api/discover',
			APP_MOUNT_PATH: process.env.APP_MOUNT_PATH ?? '/',
		}
	},
	plugins: (env, mode) => [
		new HtmlWebpackPlugin({
			baseUrl: process.env.BASE_URL ?? '/',
			template: '../../config/index.hbs',
			title: 'ShowWhy Causal Platform',
			appMountIds: ['root', 'cookie-banner'],
			devServer: mode === 'development',
			files: {
				js: ['https://wcpstatic.microsoft.com/mscc/lib/v2/wcp-consent.js'],
			},
		}),
	],
	devServer: () => ({
		port: 3000,
		allowedHosts: 'all',
	}),
})

// remove old html-plugin
configuration.plugins.shift()
delete configuration.baseUrl
module.exports = configuration
