/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { buildLoadNode } from '@showwhy/builders'
import type { Maybe, NodeRequest } from '@showwhy/types'
import { useCallback, useMemo } from 'react'
import { useBuildEstimateEffectNode } from '~resources/hooks'
import type { ProjectFile } from '~types'

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
