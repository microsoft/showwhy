/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRecoilValue } from 'recoil'

import { CausalDiscoveryResultsState } from '../../state/index.js'

export function useInterventionModelId(): string | undefined {
	const state = useRecoilValue(CausalDiscoveryResultsState)
	return state.graph.interventionModelId
}

export function useIsCausalInferenceSupported(): boolean {
	const interventionModelId = useInterventionModelId()
	return interventionModelId !== undefined
}
