/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEstimatorHook } from './estimators'
import { useRefutations } from './refutations'
import { GenericObject } from '~types'

export const useBusinessLogic = (): GenericObject => {
	return {
		...useEstimatorHook(),
		...useRefutations(),
	}
}
