/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { BaseFile } from '@datashaper/utilities'
import { createBaseFile } from '@datashaper/utilities'
import { useCallback } from 'react'

export function useOnOpenFileRequested(
	onLoadTable: (baseFile: BaseFile) => void,
): (acceptedFileTypes: string[]) => void {
	return useCallback(
		(acceptedFileTypes: string[]) => {
			let input: HTMLInputElement | null = document.createElement('input')
			input.type = 'file'
			input.multiple = false
			input.accept = acceptedFileTypes.toString()
			// eslint-disable-next-line
			input.onchange = (e: any) => {
				// eslint-disable-next-line
				if (e?.target?.files?.length) {
					// eslint-disable-next-line
					const files: FileList = e.target.files
					try {
						const { name }: { name: string } = files[0]
						const baseFile = createBaseFile(files[0], { name })
						//depending of the type // we don't have FileType yet
						onLoadTable(baseFile)
					} catch (e) {
						console.error(e)
					}
				}
			}
			input.click()
			input = null
		},
		[onLoadTable],
	)
}
