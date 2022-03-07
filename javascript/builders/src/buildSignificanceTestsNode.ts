/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NodeRequest } from '@showwhy/types'
import { GraphNodeType } from '@showwhy/types'
import { buildNodes } from './buildNodes'

export function buildSignificanceTestsNode(taskIds: string[]): NodeRequest {
	const nodeReq = buildNodes([
		{
			type: GraphNodeType.SignificanceTest,
			spec_ids: taskIds,
		},
	])
	return nodeReq
}
