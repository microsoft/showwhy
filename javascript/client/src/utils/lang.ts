/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function pluralize(len: number): string {
	return len !== 1 ? 's' : ''
}
