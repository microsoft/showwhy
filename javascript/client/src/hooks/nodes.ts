/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	buildAlternativeModels,
	buildEstimators,
	buildLoadNode,
	buildNodes,
	buildRefutationSpecs,
	buildSpecs,
} from '@showwhy/builders'
import type { GraphNodeData, Maybe, NodeRequest } from '@showwhy/types'
import { GraphNodeType } from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import type { ProjectFile } from '~types'

import { useNodeProperties } from './nodeProperties'

//TODO: fix for CI
export function useGetNodes(
	projectFiles: ProjectFile[],
): (url: string, fileName: string) => Maybe<NodeRequest> {
	const estimateNode = useEstimateNode(projectFiles)

	return useCallback(
		(url: string, fileName: string): Maybe<NodeRequest> => {
			if (projectFiles.length && estimateNode) {
				const loadNode = buildLoadNode(url, fileName)
				return {
					nodes: [...loadNode.nodes, ...estimateNode.nodes],
				}
			}
			return undefined
		},
		[estimateNode, projectFiles],
	)
}

export function useEstimateNode(
	projectFiles: ProjectFile[],
): Maybe<NodeRequest> {
	const buildEstimateEffectNode = useBuildEstimateEffectNode()
	return useMemo(() => {
		if (!projectFiles.length) {
			return undefined
		}
		return buildEstimateEffectNode(projectFiles[0]!.name)
	}, [projectFiles, buildEstimateEffectNode])
}

function useGetNodeProperties(): (fileName: string) => Partial<GraphNodeData> {
	const {
		definitions,
		estimators,
		refutationType,
		confidenceInterval,
		maximumLevel,
		minimumModel,
		intermediateLevel,
		unadjustedModel,
	} = useNodeProperties()

	return useCallback(
		(fileName: string) => {
			const population = definitions?.population?.definition || []
			const exposure = definitions?.exposure?.definition || []
			const outcome = definitions?.outcome?.definition || []
			const [dataframeName] = fileName.split('.')

			const properties = {
				...buildSpecs(dataframeName ?? 'data', population, exposure, outcome),
				model_specs: buildAlternativeModels(
					maximumLevel,
					minimumModel,
					intermediateLevel,
					unadjustedModel,
				),
				estimator_specs: buildEstimators([...estimators]),
				refuter_specs: buildRefutationSpecs(refutationType),
				confidence_interval: confidenceInterval,
			}
			return properties
		},
		[
			definitions,
			estimators,
			refutationType,
			confidenceInterval,
			maximumLevel,
			minimumModel,
			intermediateLevel,
			unadjustedModel,
		],
	)
}

function useBuildEstimateEffectNode(): (fileName: string) => NodeRequest {
	const getNodeProperties = useGetNodeProperties()
	return useCallback(
		(fileName: string) => {
			const nodeReq = buildNodes([
				{
					type: GraphNodeType.EstimateEffects,
					...getNodeProperties(fileName),
				},
			])
			return nodeReq
		},
		[getNodeProperties],
	)
}
