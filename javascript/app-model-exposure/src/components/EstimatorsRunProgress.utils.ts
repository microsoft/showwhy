/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus } from '../types/api/NodeResponseStatus.js'

export function returnProgressStatus(
	specCompleted: number,
	specCount: number,
): NodeResponseStatus {
	return specCompleted === specCount && specCompleted !== 0
		? NodeResponseStatus.Success
		: specCompleted > 0
		? NodeResponseStatus.Started
		: NodeResponseStatus.Pending
}
