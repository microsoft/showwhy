/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import difference from 'lodash/difference'
import { useCallback, useMemo, useState } from 'react'

import { ApiType } from '../../api-client/FetchApiInteractor.types.js'
import { checkStatus } from '../../api-client/FetchApiInteractor.utils.js'
import { isStatus } from '../../api-client/utils.js'
import { api } from '../../resources/api.js'
import { useSetSignificanceTest } from '../../state/significanceTests.js'
import { NodeResponseStatus } from '../../types/api/NodeResponseStatus.js'
import type { SignificanceTestStatus } from '../../types/api/SignificanceTestStatus.js'
import type { Handler, Maybe } from '../../types/primitives.js'
import type { Specification } from '../../types/visualization/Specification.js'
import type { SpecificationCurveConfig } from '../../types/visualization/SpecificationCurveConfig.js'
import { updateSignificanceTests } from '../../utils/significanceTests.js'
import { percentage } from '../../utils/stats.js'
import { useDefaultRun } from '../runHistory.js'

export function useSignificanceTestManagement(
	failedRefutationTaskIds: string[],
	specificationData: Specification[],
	specificationCurveConfig: SpecificationCurveConfig,
	selectedOutcome: string,
	significanceTestResult: Maybe<SignificanceTestStatus>,
): {
	cancelRun: Handler
	runSignificance: Handler
	isCanceled: boolean
	activeEstimatedEffects: number[]
	taskIdsChanged: boolean
} {
	const defaultRun = useDefaultRun()
	const [isCanceled, setIsCanceled] = useState<boolean>(false)
	const setSignificanceTest = useSetSignificanceTest()

	const activeSpecifications = useMemo((): Specification[] => {
		return specificationData
			.filter(
				(x) =>
					!(
						specificationCurveConfig?.inactiveSpecifications?.includes(x.id) ||
						failedRefutationTaskIds.includes(x.taskId)
					),
			)
			.filter((s) => s.outcome === selectedOutcome)
	}, [
		specificationData,
		specificationCurveConfig,
		failedRefutationTaskIds,
		selectedOutcome,
	])

	const activeTaskIds = useMemo((): string[] => {
		return activeSpecifications.map((x) => x.taskId)
	}, [activeSpecifications])

	const activeEstimatedEffects = useMemo(() => {
		return activeSpecifications.map((x) => x.estimatedEffect)
	}, [activeSpecifications])

	const taskIdsChanged = useMemo((): boolean => {
		return !!difference(significanceTestResult?.taskIds, activeTaskIds).length
	}, [activeTaskIds, significanceTestResult])

	const onUpdate = useCallback(
		(taskId: string, response: SignificanceTestStatus) => {
			if (isStatus(response.status, NodeResponseStatus.Revoked)) {
				return updateSignificanceTests(
					setSignificanceTest,
					taskId,
					selectedOutcome,
				)
			}

			if (!taskId) return null
			const result = {
				...response,
				taskId,
				outcome: selectedOutcome,
				percentage: percentage(response?.completed || 0, 100),
			} as Partial<SignificanceTestStatus>
			updateSignificanceTests(
				setSignificanceTest,
				taskId,
				selectedOutcome,
				result,
			)
		},
		[setSignificanceTest, selectedOutcome],
	)

	const cancelRun = useCallback(() => {
		if (!defaultRun) return
		setIsCanceled(true)
		void api.cancel(defaultRun?.id, ApiType.EstimateEffect)
	}, [setIsCanceled, defaultRun])

	const runSignificance = useCallback(() => {
		if (!defaultRun) return
		const f = async (): Promise<void> => {
			const body = { estimate_execution_ids: activeTaskIds }
			const execution = await api.executeValidation(
				defaultRun?.id,
				ApiType.SignificanceTest,
				body,
			)
			const initialRun = getSignificanceTest(
				defaultRun?.id,
				selectedOutcome,
				activeTaskIds,
			)
			updateSignificanceTests(
				setSignificanceTest,
				defaultRun?.id,
				selectedOutcome,
				initialRun,
			)
			void checkStatus(
				execution.id,
				ApiType.SignificanceTest,
				onUpdate,
				defaultRun?.id,
			)
		}
		void f()
	}, [
		onUpdate,
		setSignificanceTest,
		selectedOutcome,
		defaultRun,
		activeTaskIds,
	])

	return {
		cancelRun,
		runSignificance,
		isCanceled,
		activeEstimatedEffects,
		taskIdsChanged,
	}
}

function getSignificanceTest(
	taskId: string,
	outcome: string,
	taskIds: string[],
): SignificanceTestStatus {
	return {
		taskId,
		outcome,
		completed: 0,
		pending: 0,
		failed: 0,
		status: NodeResponseStatus.Pending,
		startTime: new Date(),
		taskIds,
	}
}
