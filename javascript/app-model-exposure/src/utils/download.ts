/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import * as aq from 'arquero'

// eslint-disable-next-line
export function createCSVBlob(data: any[]): Blob {
	const table = aq.from(data)
	return new Blob([table.toCSV()])
}

export function download(filename: string, type: string, data: Blob): void {
	const dataURI = URL.createObjectURL(data)
	const link = document.createElement('a')
	link.href = dataURI
	link.type = type
	link.download = filename
	link.click()
}
