/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NodeRequest } from '@showwhy/types'
import { GraphNodeType } from '@showwhy/types'
import { buildNodes } from './buildNodes'

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
