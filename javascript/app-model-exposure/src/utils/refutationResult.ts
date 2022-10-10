/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DEFAULT_REFUTATION_TESTS } from '../constants.js'
import type { RefutationResultType } from '../types/api/RefutationResultType.js'

export function check_refutation_result(
	refutationResult: RefutationResultType,
): RefutationResultType {
	const refutationExistingKeys = Object.keys(refutationResult)
	let result = 2
	if (
		!DEFAULT_REFUTATION_TESTS.every(t => refutationExistingKeys.includes(t))
	) {
		result = -1
	} else {
		if (
			refutationExistingKeys.some(
				g => refutationResult[g as keyof RefutationResultType] !== 1,
			)
		) {
			result = 0
		}
	}
	refutationResult.refutation_result = result
	return refutationResult
}
