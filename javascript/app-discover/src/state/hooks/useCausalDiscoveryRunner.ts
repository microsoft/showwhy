/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { discover as runCausalDiscovery } from '../../domain/CausalDiscovery/CausalDiscovery.js'
import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { RelationshipReference } from '../../domain/Relationship.js'
import {
	CausalDiscoveryResultsState,
	CausalGraphConstraintsState,
	DEFAULT_DATASET_NAME,
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
	const setLoadingState = useSetRecoilState(LoadingState)
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
			forbiddenRelationships: [
				...userConstraints.forbiddenRelationships,
				...derivedConstraints,
			],
		}),
		[userConstraints, derivedConstraints],
	)

	const updateProgress = useCallback(
		(progress: number, taskId?: string) => {
			setLoadingState(`Running causal discovery ${progress.toFixed(1)}%...`)
		},
		[setLoadingState],
	)

	useEffect(() => {
		if (
			inModelCausalVariables.length < 2 ||
			dataset.name === DEFAULT_DATASET_NAME
		) {
			setCausalDiscoveryResultsState({
				graph: {
					variables: inModelCausalVariables,
					relationships: [],
					constraints: causalDiscoveryConstraints,
					algorithm,
				},
				causalInferenceModel: null,
			})
		}

		updateProgress(0, undefined)
		const runDiscovery = async () => {
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
				}
			} catch (err) {
				setLoadingState('Cancelling last task...')
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
	])
}
