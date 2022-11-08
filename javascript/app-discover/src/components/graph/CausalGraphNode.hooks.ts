/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCausalInferenceModel } from '../../state/index.js'

export function useIsCausalInferenceSupported(): boolean {
	const state = useCausalInferenceModel()
	return state != null
}
