/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function useIsCausalInferenceSupported(): boolean {
	// const state = useCausalInferenceModel()
	// return state != null
	return false // disabled until we have a more efficient way to compute inference
}
