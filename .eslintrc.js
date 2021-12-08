/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
module.exports = {
	extends: '@essex/eslint-config',
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'no-redeclare': 'off',
		'@typescript-eslint/no-redeclare': ['warn'],
		'@typescript-eslint/explicit-module-boundary-types': [
			'warn',
			{ allowArgumentsExplicitlyTypedAsAny: true },
		],
		// TODO: Re-enable
		'jsx-a11y/click-events-have-key-events': 0,
		'jsx-a11y/no-static-element-interactions': 0,
	},
}
