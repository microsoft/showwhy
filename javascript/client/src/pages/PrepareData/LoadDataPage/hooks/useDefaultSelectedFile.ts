/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@showwhy/types'
import { useEffect } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { ProjectFile } from '~types'

export function useDefaultSelectedFile(
	current: Maybe<ProjectFile>,
	files: ProjectFile[],
	setSelectedFile: SetterOrUpdater<Maybe<ProjectFile>>,
): void {
	useEffect(() => {
		if (!current) {
			const [file] = files
			if (file && file.loadedCorrectly === undefined) {
				file.loadedCorrectly = true
			}
			setSelectedFile(file)
		}
	}, [files, current, setSelectedFile])
}
