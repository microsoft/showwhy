/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { useEstimatorHook } from './estimators'
import { Refutation, useRefutations } from './refutations'

export function useBusinessLogic(): {
	refutations: Refutation[]
} {
	const refutations = useRefutations()
	const estimatorHook = useEstimatorHook()

	return useMemo(
		() => ({
			...estimatorHook,
			refutations,
		}),
		[estimatorHook, refutations],
	)
}
