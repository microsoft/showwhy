/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect, useMemo } from 'react'
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'

import {
	discover as runCausalDiscovery,
	empty_discover_result,
} from '../../domain/CausalDiscovery/CausalDiscovery.js'
import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type {
	Relationship,
	RelationshipReference,
} from '../../domain/Relationship.js'
import {
	invertRelationship,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import { CanceledPromiseError } from '../../utils/CancelablePromise.js'
import {
	CausalDiscoveryResultsState,
	CausalGraphConstraintsState,
	DEFAULT_DATASET_NAME,
	ErrorMessageState,
	LoadingState,
	PauseAutoRunState,
	SelectedCausalDiscoveryAlgorithmState,
} from '../atoms/index.js'
import {
	DatasetState,
	InModelCausalVariablesState,
} from '../selectors/index.js'
import type { DECIParams } from './../../domain/Algorithms/DECI.js'
import { DeciParamsState } from './../atoms/algorithms_params.js'
import { useLastDiscoveryResultPromise } from './useLastDiscoveryResultPromise.js'

export function useCausalDiscoveryRunner() {
	const dataset = useRecoilValue(DatasetState)
	const inModelCausalVariables = useRecoilValue(InModelCausalVariablesState)
	const userConstraints = useRecoilValue(CausalGraphConstraintsState)
	const causalDiscoveryAlgorithm = useRecoilValue(
		SelectedCausalDiscoveryAlgorithmState,
	)
	const DECIParams = useRecoilValue(DeciParamsState)
	const pauseAutoRun = useRecoilValue(PauseAutoRunState)
	const algorithm = useMemo(
		() => pauseAutoRun ?? causalDiscoveryAlgorithm,
		[pauseAutoRun, causalDiscoveryAlgorithm],
	)

	const algorithmParams = useMemo((): DECIParams | undefined => {
		return causalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.DECI
			? DECIParams
			: undefined
	}, [DECIParams, causalDiscoveryAlgorithm])
	const setCausalDiscoveryResultsState = useSetRecoilState(
		CausalDiscoveryResultsState,
	)
	const resetCausalDiscoveryResultsState = useResetRecoilState(
		CausalDiscoveryResultsState,
	)
	const setLoadingState = useSetRecoilState(LoadingState)
	const setErrorMessage = useSetRecoilState(ErrorMessageState)
	const [setLastDiscoveryResultPromise, cancelLastDiscoveryResultPromise] =
		useLastDiscoveryResultPromise()

	const derivedConstraints = useMemo<RelationshipReference[]>(() => {
		const result: RelationshipReference[] = []
		inModelCausalVariables.forEach(sourceVar => {
			sourceVar.derivedFrom?.forEach(sourceColumn => {
				inModelCausalVariables.forEach(targetVar => {
					if (
						sourceVar !== targetVar &&
						(targetVar.derivedFrom?.includes(sourceColumn) ||
							sourceVar.disallowedRelationships?.includes(targetVar.columnName))
					) {
						result.push({
							source: sourceVar,
							target: targetVar,
						})
					}
				})
			})
		})
		return result
	}, [inModelCausalVariables])

	const causalDiscoveryConstraints = useMemo(
		() => ({
			...userConstraints,
			manualRelationships: [
				...userConstraints.manualRelationships.map(x => {
					if (
						x.reason &&
						[
							ManualRelationshipReason.Flipped,
							ManualRelationshipReason.Pinned,
						].includes(x.reason)
					) {
						return invertRelationship(x)
					}
					return x
				}),
				...derivedConstraints,
			] as Relationship[],
		}),
		[userConstraints, derivedConstraints],
	)

	const updateProgress = useCallback(
		(progress: number, taskId?: string) => {
			setLoadingState(`Running causal discovery ${progress.toFixed(0)}%...`)
		},
		[setLoadingState],
	)

	useEffect(() => {
		if (
			inModelCausalVariables.length < 2 ||
			dataset.name === DEFAULT_DATASET_NAME
		) {
			setCausalDiscoveryResultsState(
				empty_discover_result(
					inModelCausalVariables,
					causalDiscoveryConstraints,
					algorithm,
				),
			)
		}

		updateProgress(0, undefined)
		const runDiscovery = async () => {
			setErrorMessage(undefined)

			// if the last task has not finished just yet, cancel it
			await cancelLastDiscoveryResultPromise()

			const discoveryPromise = runCausalDiscovery(
				dataset,
				inModelCausalVariables,
				causalDiscoveryConstraints,
				algorithm,
				updateProgress,
				algorithmParams,
			)

			setLastDiscoveryResultPromise(discoveryPromise)

			try {
				const results = await discoveryPromise.promise!

				// only update if the promise is not canceled
				if (discoveryPromise.isFinished()) {
					setCausalDiscoveryResultsState(results)
					setLoadingState(undefined)
					setErrorMessage(undefined)
				}
			} catch (err) {
				if (!(err instanceof CanceledPromiseError)) {
					resetCausalDiscoveryResultsState()
					setLoadingState(undefined)
					setErrorMessage((err as Error).message)
				}
			}
		}

		void runDiscovery()

		return () => {
			void cancelLastDiscoveryResultPromise()
		}
	}, [
		dataset,
		inModelCausalVariables,
		userConstraints,
		algorithm,
		causalDiscoveryConstraints,
		setLoadingState,
		setCausalDiscoveryResultsState,
		updateProgress,
		algorithmParams,
		cancelLastDiscoveryResultPromise,
		setLastDiscoveryResultPromise,
		setErrorMessage,
		resetCausalDiscoveryResultsState,
	])
}
