/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'
import { useBuildEstimateEffectNode } from '~resources/hooks'
import { buildLoadNode } from '~resources/prepareDoWhyData'
import { NodeRequest, ProjectFile } from '~types'

//TODO: fix for CI
export function useGetNodes(
	projectFiles: ProjectFile[],
): (url: string, fileName: string) => NodeRequest | undefined {
	const estimateNode = useEstimateNode(projectFiles)

	return useCallback(
		(url: string, fileName: string): NodeRequest | undefined => {
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
): NodeRequest | undefined {
	const buildEstimateEffectNode = useBuildEstimateEffectNode()
	return useMemo(() => {
		if (!projectFiles.length) {
			return undefined
		}
		return buildEstimateEffectNode(projectFiles[0].name)
	}, [projectFiles, buildEstimateEffectNode])
}
