/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileCollection } from '@data-wrangling-components/utilities'
import type { DropFilesCount } from '@showwhy/components'
import type { ProjectFile } from '@showwhy/types'
import { useState } from 'react'

import { useHandleOnDrop } from './useHandleDrop'
import { useOnDropAccepted } from './useOnDropAccepted'
import { useOnDropRejected } from './useOnDropRejected'
import { useOnLoadCompleted } from './useOnLoadCompleted'
import { useOnLoadStart } from './useOnLoadStart'
import { useResetFilesCount } from './useResetFilesCount'

export function useGlobalDropzone(
	onError?: (msg: string) => void,
	onLoad?: (file: ProjectFile) => void,
): {
	onDrop: (f: FileCollection) => void
	onDropAccepted: (f: FileCollection) => void
	onDropRejected: (msg: string) => void
	fileCount: DropFilesCount
	loading: boolean
	progress?: number
} {
	const [loading, setLoading] = useState<boolean>(false)
	const [progress, setProgress] = useState<number | undefined>()
	const [fileCount, setFileCount] = useState<DropFilesCount>({
		total: 0,
		completed: 0,
	})
	const resetCount = useResetFilesCount(setFileCount)
	const onLoadStart = useOnLoadStart(setLoading, onError)
	const onFileLoadCompleted = useOnLoadCompleted(
		setFileCount,
		setLoading,
		onLoad,
	)
	const onDrop = useHandleOnDrop(onFileLoadCompleted, onLoadStart, setProgress)
	const onDropAccepted = useOnDropAccepted(onError, setFileCount)
	const onDropRejected = useOnDropRejected(onError, resetCount)

	return {
		onDrop,
		onDropAccepted,
		onDropRejected,
		fileCount,
		loading,
		progress,
	}
}
