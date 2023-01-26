/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus } from '../types/api/NodeResponseStatus.js'
import type { Maybe } from '../types/primitives.js'

export function wait(ms: number): Promise<boolean> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true)
		}, ms)
	})
}

export function isProcessingStatus(nodeStatus: NodeResponseStatus): boolean {
	const status = nodeStatus?.toLowerCase()
	return (
		status === NodeResponseStatus.Pending ||
		status === NodeResponseStatus.Started
	)
}

export function isStatus(
	status: Maybe<NodeResponseStatus>,
	match: NodeResponseStatus,
): boolean {
	return (status && status.toLowerCase() === match) ?? false
}
