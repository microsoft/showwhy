/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { discover as runCausalDiscovery } from '../../domain/CausalDiscovery/CausalDiscovery.js'
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

export function useCausalDiscoveryRunner() {
	const dataset = useRecoilValue(DatasetState)
	const inModelCausalVariables = useRecoilValue(InModelCausalVariablesState)
	const userConstraints = useRecoilValue(CausalGraphConstraintsState)
	const causalDiscoveryAlgorithm = useRecoilValue(
		SelectedCausalDiscoveryAlgorithmState,
	)
	const pauseAutoRun = useRecoilValue(PauseAutoRunState)
	const algorithm = useMemo(
		() => pauseAutoRun ?? causalDiscoveryAlgorithm,
		[pauseAutoRun, causalDiscoveryAlgorithm],
	)

	const setCausalDiscoveryResultsState = useSetRecoilState(
		CausalDiscoveryResultsState,
	)
	const setLoadingState = useSetRecoilState(LoadingState)

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
		(progress: number) => {
			setLoadingState(`Running causal discovery ${progress}%...`)
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

		updateProgress(0)
		const runDiscovery = async () => {
			const results = await runCausalDiscovery(
				dataset,
				inModelCausalVariables,
				causalDiscoveryConstraints,
				algorithm,
				updateProgress,
			)
			setCausalDiscoveryResultsState(results)
			setLoadingState(undefined)
		}

		void runDiscovery()
	}, [
		dataset,
		inModelCausalVariables,
		userConstraints,
		algorithm,
		causalDiscoveryConstraints,
		setLoadingState,
		setCausalDiscoveryResultsState,
		updateProgress,
	])
}
