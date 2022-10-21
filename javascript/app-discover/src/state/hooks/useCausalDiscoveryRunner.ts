/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { cancelDiscoverTask } from '../../api/api.js'
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

	const lastTaskId = useRef<string | undefined>(undefined)

	const setLastTaskId = useCallback(
		(taskId?: string) => {
			lastTaskId.current = taskId
		},
		[lastTaskId],
	)

	const cancelLastTask = useCallback(async () => {
		if (lastTaskId.current) {
			await cancelDiscoverTask(lastTaskId.current)
			lastTaskId.current = undefined
		}
	}, [lastTaskId, cancelDiscoverTask])

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
			setLoadingState(`Running causal discovery ${progress}%...`)
			setLastTaskId(taskId)
		},
		[setLoadingState, setLastTaskId],
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
			await cancelLastTask()

			const results = await runCausalDiscovery(
				dataset,
				inModelCausalVariables,
				causalDiscoveryConstraints,
				algorithm,
				updateProgress,
				algorithmParams,
			)

			// TODO: this is just a workaround, we should
			// block the UI instead to only call the backend once all
			// properties are set and disable inputs while running
			//
			// only update if the result if for the last task
			if (!results.taskId || results.taskId === lastTaskId.current) {
				setCausalDiscoveryResultsState(results)
				setLoadingState(undefined)
			}
			setLastTaskId(undefined)
		}

		void runDiscovery()

		return () => {
			// if the last task has not finished just yet, cancel it
			void cancelLastTask()
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
		setLastTaskId,
		cancelLastTask,
		algorithmParams,
	])
}
