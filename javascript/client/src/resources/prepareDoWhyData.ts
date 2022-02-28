/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeRequest, GraphNodeType } from '@showwhy/api-client'
import { buildNodes } from './builders'

export function buildSignificanceTestsNode(taskIds: string[]): NodeRequest {
	const nodeReq = buildNodes([
		{
			type: GraphNodeType.SignificanceTest,
			spec_ids: taskIds,
		},
	])
	return nodeReq
}

export function buildLoadNode(url: string, fileName: string): NodeRequest {
	const [dataframeName] = fileName.split('.')
	const nodeReq = buildNodes([
		{
			type: GraphNodeType.LoadDataset,
			result: dataframeName,
			url,
		},
	])
	return nodeReq
}
