/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { NodeResponseStatus } from '~enums'
import { NodeRequest, ProjectFile, RunHistory } from '~interfaces'
import { useBuildEstimateEffectNode } from '~resources/hooks'

export const useIsProcessing = (runHistory: RunHistory[]): boolean => {
	return useMemo((): boolean => {
		return !!runHistory.filter(x => {
			const status = x.status?.status.toLowerCase()
			return (
				status === NodeResponseStatus.Running ||
				status === NodeResponseStatus.InProgress ||
				status === NodeResponseStatus.Pending ||
				status === NodeResponseStatus.Processing
			)
		}).length
	}, [runHistory])
}

export const useEstimateNode = (
	projectFiles: ProjectFile[],
): NodeRequest | undefined => {
	const buildEstimateEffectNode = useBuildEstimateEffectNode()
	return useMemo(() => {
		if (!projectFiles.length) {
			return
		}
		return buildEstimateEffectNode(projectFiles[0].name)
	}, [projectFiles])
}
