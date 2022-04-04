/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OrchestratorType } from '@showwhy/api-client'
import { buildSignificanceTestsNode } from '@showwhy/builders'
import type {
	AlternativeModels,
	Experiment,
	Handler,
	Maybe,
	RefutationType,
	SignificanceTest,
} from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { useCallback, useMemo, useState } from 'react'

import {
	useActualSignificanceTest,
	useAlternativeModels,
	useCausalEffects,
	useDefaultRun,
	useRefutationLength,
	useRunSignificanceTest,
	useSpecificationCurve,
} from '~hooks'
import {
	useDefaultDatasetResult,
	useExperiment,
	usePrimarySpecificationConfig,
	useRefutationType,
	useSpecificationCurveConfig,
} from '~state'
import type { DefaultDatasetResult, RunHistory, Specification } from '~types'

import { useLoadSpecificationData } from '../ExploreSpecificationCurvePage/hooks'

export function useBusinessLogic(): {
	alternativeModels: AlternativeModels
	defaultRun: Maybe<RunHistory>
	causalEffects: ReturnType<typeof useCausalEffects>
	specificationData: Specification[]
	defaultDataset: DefaultDatasetResult | null
	refutationLength: number
	defineQuestion: Experiment
	activeValues: number[]
	significanceTestResult: Maybe<SignificanceTest>
	significanceFailed: boolean
	activeTaskIds: string[]
	refutationType: RefutationType
	isCanceled: boolean
	runSignificance: (taskIds: string[]) => void
	cancelRun: Handler
} {
	const defineQuestion = useExperiment()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const causalModel = primarySpecificationConfig.causalModel
	const causalEffects = useCausalEffects(causalModel)
	const alternativeModels = useAlternativeModels(causalModel)
	const specificationData = useLoadSpecificationData()
	const specificationCurveConfig = useSpecificationCurveConfig()
	const refutation = useRefutationType()
	const defaultDataset = useDefaultDatasetResult()
	const run = useRunSignificanceTest()
	const defaultRun = useDefaultRun()
	const { failedRefutationIds } = useSpecificationCurve()
	const [isCanceled, setIsCanceled] = useState<boolean>(false)
	const refutationLength = useRefutationLength()
	const significanceTestResult = useActualSignificanceTest()

	const refutationType = useMemo((): RefutationType => {
		if (defaultRun && defaultRun?.refutationType) {
			return defaultRun?.refutationType
		}
		return refutation
	}, [defaultRun, refutation])

	// const runFullRefutation = useCallback(async () => {
	// 	setFullRefutation()
	// 	await wait(300)
	// 	await sendData()
	// 	history.push(Pages.EstimateCausalEffects)
	// }, [sendData, setFullRefutation, history])

	const activeValues = useMemo<number[]>(() => {
		return specificationData
			.filter(
				x =>
					!specificationCurveConfig?.inactiveSpecifications?.includes(x.id) &&
					!failedRefutationIds.includes(x.id),
			)
			.map(x => x.estimatedEffect)
	}, [specificationData, specificationCurveConfig, failedRefutationIds])

	const activeTaskIds = useMemo((): string[] => {
		return specificationData
			.filter(
				x =>
					!specificationCurveConfig?.inactiveSpecifications?.includes(x.id) &&
					!failedRefutationIds.includes(x.id),
			)
			.map(x => x.taskId)
	}, [specificationData, specificationCurveConfig, failedRefutationIds])

	const cancelRun = useCallback(() => {
		setIsCanceled(true)
		run().cancel()
	}, [run, setIsCanceled])

	const runSignificance = useCallback(
		(taskIds: string[]) => {
			const nodes = buildSignificanceTestsNode(taskIds)
			run().execute(nodes, OrchestratorType.ConfidenceInterval)
		},
		[run],
	)

	const significanceFailed = useMemo((): boolean => {
		return (
			significanceTestResult?.status?.toLowerCase() ===
			NodeResponseStatus.Failed
		)
	}, [significanceTestResult])

	return {
		alternativeModels,
		defaultRun,
		causalEffects,
		specificationData,
		defaultDataset,
		refutationLength,
		defineQuestion,
		activeValues,
		significanceTestResult,
		significanceFailed,
		activeTaskIds,
		refutationType,
		isCanceled,
		runSignificance,
		cancelRun,
	}
}
