/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { OrchestratorType } from '@showwhy/api-client'
import { buildLoadNode } from '@showwhy/builders'
import type { AsyncHandler, Handler, Maybe, NodeRequest } from '@showwhy/types'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { OUTPUT_FILE_NAME } from '~constants'
import { useEstimateNode, useSaveNewRun, useWakeLock } from '~hooks'
import { SESSION_ID_KEY, setStorageItem, useSpecCount } from '~state'

import { useLoadSpecCount } from './useLoadSpecCount'
import { useRunEstimate } from './useRunEstimate'
import { useUploadFile } from './useUploadFile'

export function useEstimateLogic(isProcessing: boolean): {
	specCount: Maybe<number>
	errors: Maybe<string>
	cancelRun: Handler
	runEstimate: AsyncHandler
	loadingSpecCount: boolean
	isCanceled: boolean
	loadingFile: boolean
} {
	const [
		loadingFile,
		{ setTrue: trueLoadingFile, setFalse: falseLoadingFile },
	] = useBoolean(false)
	const [isCanceled, setIsCanceled] = useState<boolean>(false)
	const [errors, setErrors] = useState<string>('')
	const specCount = useSpecCount()
	const run = useRunEstimate()
	const uploadFile = useUploadFile(setErrors, falseLoadingFile)
	const saveNewRun = useSaveNewRun()
	const estimateNode = useEstimateNode(OUTPUT_FILE_NAME)

	const loadingSpecCount = useLoadSpecCount(
		estimateNode,
		isProcessing,
		setErrors,
	)
	useWakeLock()

	async function runEstimate() {
		setIsCanceled(false)
		trueLoadingFile()
		setStorageItem(SESSION_ID_KEY, uuidv4())

		const files = await uploadFile()
		if (!files) return
		saveNewRun()
		const loadNode = buildLoadNode(
			files.uploaded_files[OUTPUT_FILE_NAME]!,
			OUTPUT_FILE_NAME,
		)
		const nodes = {
			nodes: [...loadNode.nodes, ...(estimateNode as NodeRequest).nodes],
		}
		await run().execute(nodes, OrchestratorType.Estimator)
	}

	async function cancelRun() {
		setIsCanceled(true)
		run().cancel()
	}

	return {
		specCount,
		errors,
		cancelRun,
		runEstimate,
		loadingSpecCount,
		isCanceled,
		loadingFile,
	}
}
