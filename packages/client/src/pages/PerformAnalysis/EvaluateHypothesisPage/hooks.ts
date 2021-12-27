/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'
import { useRunSignificanceTests } from '../../../hooks/significanceTests'
import { useLoadSpecificationData } from '../ExploreSpecificationCurvePage/hooks'
import { NodeResponseStatus, RefutationTypes } from '~enums'
import {
	useAlternativeModels,
	useDefaultRun,
	useCausalEffects,
	useRefutationLength,
	useSpecificationCurve,
} from '~hooks'

import {
	useDefaultDatasetResult,
	useDefineQuestion,
	usePrimarySpecificationConfig,
	useRefutationType,
	useSignificanceTests,
	useSpecificationCurveConfig,
} from '~state'

import { GenericObject } from '~types'

export const useBusinessLogic = (): GenericObject => {
	const defineQuestion = useDefineQuestion()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const causalModel = primarySpecificationConfig.causalModel
	const causalEffects = useCausalEffects(causalModel)
	const alternativeModels = useAlternativeModels(causalModel)
	const specificationData = useLoadSpecificationData()
	const specificationCurveConfig = useSpecificationCurveConfig()
	const refutation = useRefutationType()
	const defaultDataset = useDefaultDatasetResult()
	const defaultRun = useDefaultRun()
	const { failedRefutationIds } = useSpecificationCurve()
	const refutationLength = useRefutationLength()
	const runSignificanceTests = useRunSignificanceTests(defaultRun?.id as string)
	const significanceTestsResult = useSignificanceTests(defaultRun?.id as string)

	const refutationType = useMemo((): RefutationTypes => {
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

	const activeValues = useMemo((): any => {
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

	const runSignificance = useCallback(
		(taskIds: string[]) => {
			runSignificanceTests(taskIds)
		},
		[activeTaskIds, runSignificanceTests],
	)

	const significanceFailed = useMemo((): boolean => {
		return (
			significanceTestsResult?.status?.toLowerCase() ===
			NodeResponseStatus.Failed
		)
	}, [significanceTestsResult])

	return {
		alternativeModels,
		defaultRun,
		causalEffects,
		specificationData,
		defaultDataset,
		refutationLength,
		defineQuestion,
		activeValues,
		runSignificance,
		significanceTestsResult,
		significanceFailed,
		activeTaskIds,
		refutationType,
	}
}
