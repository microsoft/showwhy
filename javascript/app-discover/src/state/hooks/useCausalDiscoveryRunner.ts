/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	useRecoilState,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

import { empty_discover_result } from '../../domain/CausalDiscovery/CausalDiscovery.js'
import { CanceledPromiseError } from '../../utils/CancelablePromise.js'
import {
	AutoRunState,
	CausalDiscoveryResultsState,
	CausalGraphConstraintsState,
	DEFAULT_DATASET_NAME,
	ErrorMessageState,
	InfoMessageState,
	LoadingState,
	SelectedCausalDiscoveryAlgorithmState,
} from '../atoms/index.js'
import {
	DatasetState,
	InModelCausalVariablesState,
} from '../selectors/index.js'
import { useAlgorithmParams } from './useAlgorithmParams.js'
import { useCausalDiscoveryConstraints } from './useCausalDiscoveryConstraints.js'
import { useCreateDiscoveryPromise } from './useCreateDiscoveryPromise.js'
import { useDerivedConstraints } from './useDerivedConstraints.js'
import { useLastDiscoveryResultPromise } from './useLastDiscoveryResultPromise.js'

export function useCausalDiscoveryRunner() {
	const dataset = useRecoilValue(DatasetState)
	const inModelCausalVariables = useRecoilValue(InModelCausalVariablesState)
	const userConstraints = useRecoilValue(CausalGraphConstraintsState)
	const causalDiscoveryAlgorithm = useRecoilValue(
		SelectedCausalDiscoveryAlgorithmState,
	)
	const [autoRun, setAutoRun] = useRecoilState(AutoRunState)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const setCausalDiscoveryResultsState = useSetRecoilState(
		CausalDiscoveryResultsState,
	)
	const resetCausalDiscoveryResultsState = useResetRecoilState(
		CausalDiscoveryResultsState,
	)
	const setLoadingState = useSetRecoilState(LoadingState)
	const setInfoMessage = useSetRecoilState(InfoMessageState)
	const setErrorMessage = useSetRecoilState(ErrorMessageState)

	const algorithmParams = useAlgorithmParams(causalDiscoveryAlgorithm)

	const [setLastDiscoveryResultPromise, cancelLastDiscoveryResultPromise] =
		useLastDiscoveryResultPromise()

	const derivedConstraints = useDerivedConstraints(inModelCausalVariables)

	const causalDiscoveryConstraints = useCausalDiscoveryConstraints(
		userConstraints,
		derivedConstraints,
	)

	const createDiscoveryPromise = useCreateDiscoveryPromise(
		setLastDiscoveryResultPromise,
		cancelLastDiscoveryResultPromise,
	)

	const isResetRequired = useMemo<boolean>(() => {
		return (
			!autoRun ||
			inModelCausalVariables.length < 2 ||
			dataset.name === DEFAULT_DATASET_NAME
		)
	}, [autoRun, dataset, inModelCausalVariables])

	const updateProgress = useCallback(
		(progress: number, taskId?: string) => {
			setLoadingState(`Running causal discovery ${progress.toFixed(0)}%...`)
		},
		[setLoadingState],
	)

	const runDiscovery = useCallback(async () => {
		setErrorMessage(undefined)
		setInfoMessage(undefined)

		const discoveryPromise = await createDiscoveryPromise(
			dataset,
			inModelCausalVariables,
			causalDiscoveryConstraints,
			causalDiscoveryAlgorithm,
			updateProgress,
			algorithmParams,
		)

		try {
			setIsLoading(true)
			const results = await discoveryPromise.promise!

			// only update if the promise is not canceled
			if (discoveryPromise.isFinished()) {
				if (results.graph.isDag === false) {
					setInfoMessage(
						'Discovered graph has cycles, try running with more steps/epochs',
					)
				} else {
					setInfoMessage(undefined)
				}
				setCausalDiscoveryResultsState(results)
				setLoadingState(undefined)
				setErrorMessage(undefined)
				setIsLoading(false)
			}
		} catch (err) {
			if (!(err instanceof CanceledPromiseError)) {
				resetCausalDiscoveryResultsState()
				setErrorMessage((err as Error).message)
			}
			setLoadingState(undefined)
			setIsLoading(false)
		}
	}, [
		dataset,
		createDiscoveryPromise,
		inModelCausalVariables,
		causalDiscoveryAlgorithm,
		causalDiscoveryConstraints,
		setLoadingState,
		setCausalDiscoveryResultsState,
		updateProgress,
		algorithmParams,
		resetCausalDiscoveryResultsState,
		setErrorMessage,
		setInfoMessage,
		setIsLoading,
	])

	const stopDiscoveryRun = useCallback(async () => {
		setAutoRun(false)
		try {
			await cancelLastDiscoveryResultPromise()
		} catch (err) {
			setErrorMessage((err as Error).message)
		}
	}, [cancelLastDiscoveryResultPromise, setAutoRun, setErrorMessage])

	useEffect(() => {
		return () => {
			void stopDiscoveryRun()
		}
		/* eslint-disable-next-line */
	}, [])

	useEffect(() => {
		if (isResetRequired) {
			setCausalDiscoveryResultsState(
				empty_discover_result(
					inModelCausalVariables,
					causalDiscoveryConstraints,
					causalDiscoveryAlgorithm,
				),
			)
		}

		if (autoRun) {
			updateProgress(0, undefined)
			void runDiscovery()
		}
	}, [
		autoRun,
		inModelCausalVariables,
		causalDiscoveryAlgorithm,
		causalDiscoveryConstraints,
		setCausalDiscoveryResultsState,
		runDiscovery,
		updateProgress,
		isResetRequired,
	])

	return {
		run: runDiscovery,
		stop: stopDiscoveryRun,
		isLoading,
	}
}
