/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function dataAttr(name: string): string {
	return `[data-pw=${name}]`
}

export function generateFieldData(type: string) {
	return {
		type,
		label: `${type} label`,
		dataset: `${type} dataset`,
		description: `${type} description`,
	}
}
