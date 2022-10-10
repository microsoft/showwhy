/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StatusResponse } from './StatusResponse.js'

export interface RefutationStatus extends StatusResponse {
	results?: Refutation[]
}

export interface Refutation {
	estimate_id: string
	refuter: string
	result: number
}
