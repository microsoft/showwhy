/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState } from 'react'

import { ApiType } from '../../api-client/FetchApiInteractor.types.js'
import { OUTPUT_FILE_NAME } from '../../pages/AnalyzeTestPage.constants.js'
import { api } from '../../resources/api.js'
import { useSpecCount } from '../../state/specCount.js'
import type { AsyncHandler, Maybe } from '../../types/primitives.js'
import { useDefaultRun } from '../runHistory.js'
import { useGetRunStatus } from '../runStatus.js'
import { useEstimateProps } from '../useEstimateProps.js'
import { useWakeLock } from '../useWakeLock.js'
import { useLoadSpecCount } from './useLoadSpecCount.js'
import { useRunEstimate } from './useRunEstimate.js'
import { useUploadFile } from './useUploadFile.js'

export function useEstimateLogic(isProcessing: boolean): {
	specCount: Maybe<number>
	errors: Maybe<string>
	cancelRun: AsyncHandler
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
	const defaultRun = useDefaultRun()
	const runStatus = useGetRunStatus(defaultRun)
	const run = useRunEstimate(falseLoadingFile)
	const uploadFile = useUploadFile(setErrors)
	const estimateProps = useEstimateProps(OUTPUT_FILE_NAME)

	const loadingSpecCount = useLoadSpecCount(
		estimateProps,
		isProcessing,
		setErrors,
	)
	useWakeLock()

	const runEstimate = useCallback(async () => {
		setIsCanceled(false)
		trueLoadingFile()

		const files = await uploadFile()
		if (!files || !estimateProps) return
		await run(estimateProps)
	}, [setIsCanceled, trueLoadingFile, run, estimateProps, uploadFile])

	const cancelRun = useCallback(async () => {
		const taskId = defaultRun?.id
		if (!taskId) return

		setIsCanceled(true)
		let apiType = ApiType.RefuteEstimate
		if (runStatus.estimated_effect_completed !== specCount) {
			apiType = ApiType.EstimateEffect
		} else if (runStatus.shap_completed !== specCount) {
			apiType = ApiType.ShapInterpreter
		} else if (runStatus.confidence_interval_completed !== specCount) {
			apiType = ApiType.ConfidenceInterval
		} else if (runStatus.refute_completed !== specCount) {
			apiType = ApiType.RefuteEstimate
		}

		await api.cancel(taskId, apiType)
	}, [runStatus, setIsCanceled, specCount, defaultRun])

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
