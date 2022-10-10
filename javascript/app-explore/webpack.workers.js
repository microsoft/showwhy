/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const path = require('path')

module.exports = [
	{
		mode: 'production',
		entry: './src/utils/workers/correlation.js',
		output: {
			path: path.resolve(__dirname, 'public/workers'),
			filename: 'correlation.js',
		},
	},
]
