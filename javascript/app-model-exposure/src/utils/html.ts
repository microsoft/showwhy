/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function makeHtmlId(id: string): string {
	return id.replace(/[^a-zA-Z0-9]/g, '')
}
