/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const webappDeps = require('../javascript/webapp/package.json').dependencies
const depNames = Object.keys(webappDeps)

function makeDep(name) {
	return {
		singleton: true,
		strictVersion: true,
		eager: true,
		requiredVersion: webappDeps[name]
			.replace('workspace:', '*')
			.replace('^', ''),
	}
}

const shared = depNames.reduce((map, dep) => {
	map[dep] = makeDep(dep)
	return map
}, {})

module.exports.shared = shared
