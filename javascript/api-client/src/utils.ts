/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeResponseStatus } from './types'
import type { Maybe } from '@showwhy/types'

export function wait(ms: number): Promise<boolean> {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true)
		}, ms)
	})
}

export function isProcessingStatus(nodeStatus: NodeResponseStatus): boolean {
	const status = nodeStatus?.toLowerCase()
	return (
		status === NodeResponseStatus.Processing ||
		status === NodeResponseStatus.InProgress ||
		status === NodeResponseStatus.Pending ||
		status === NodeResponseStatus.Running
	)
}

export function isStatus(
	status: Maybe<NodeResponseStatus>,
	match: NodeResponseStatus,
): boolean {
	return (status && status.toLowerCase() === match) ?? false
}
