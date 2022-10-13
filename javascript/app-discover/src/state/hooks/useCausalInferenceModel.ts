/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRecoilValue } from 'recoil'

import type { CausalInferenceModel } from '../../domain/CausalInference.js'
import { CausalDiscoveryResultsState } from '../atoms/causal_graph.js'

export function useCausalInferenceModel(): CausalInferenceModel | null {
	const state = useRecoilValue(CausalDiscoveryResultsState)
	return state.causalInferenceModel
}
