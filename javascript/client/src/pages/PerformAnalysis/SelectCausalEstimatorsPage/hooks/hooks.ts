/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEstimatorHook } from './estimators'
import { useRefutations } from './refutations'

export function useBusinessLogic(): ReturnType<typeof useEstimatorHook> &
	ReturnType<typeof useRefutations> {
	return {
		...useEstimatorHook(),
		...useRefutations(),
	}
}
