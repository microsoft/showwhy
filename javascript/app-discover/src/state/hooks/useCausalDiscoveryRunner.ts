/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect, useMemo } from 'react'
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'

import type { DiscoverProgressCallback } from '../../api/types.js'
import {
	discover as runCausalDiscovery,
	empty_discover_result,
} from '../../domain/CausalDiscovery/CausalDiscovery.js'
import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalVariable } from '../../domain/CausalVariable.js'
import type { Dataset } from '../../domain/Dataset.js'
import type {
	Relationship,
	RelationshipReference,
} from '../../domain/Relationship.js'
import {
	hasSameReason,
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
					if (hasSameReason(ManualRelationshipReason.Flipped, x)) {
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

	const createDiscoveryPromise = useCallback(
		async (
			dataset: Dataset,
			variables: CausalVariable[],
			constraints: CausalDiscoveryConstraints,
			algorithmName: CausalDiscoveryAlgorithm,
			progressCallback?: DiscoverProgressCallback,
			paramOptions?: DECIParams,
		) => {
			// if the last task has not finished just yet, cancel it
			const lastPromiseCancel = cancelLastDiscoveryResultPromise()
			const discoveryPromise = runCausalDiscovery(
				dataset,
				variables,
				constraints,
				algorithmName,
				progressCallback,
				paramOptions,
			)

			setLastDiscoveryResultPromise(discoveryPromise)

			// the code above
			//     - cancelLastDiscoveryResultPromise/runCausalDiscovery/setLastDiscoveryResultPromise
			// needs to run without awaiting
			// so we know react wont change context and trigger a new discover promise
			// before it being properly set
			await lastPromiseCancel

			return discoveryPromise
		},
		[cancelLastDiscoveryResultPromise, setLastDiscoveryResultPromise],
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

			const discoveryPromise = await createDiscoveryPromise(
				dataset,
				inModelCausalVariables,
				causalDiscoveryConstraints,
				algorithm,
				updateProgress,
				algorithmParams,
			)

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
		createDiscoveryPromise,
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
