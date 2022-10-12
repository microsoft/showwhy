/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRecoilValue } from 'recoil'

import type { CausalGraph } from '../../domain/Graph.js'
import { CausalDiscoveryResultsState } from '../atoms/index.js'

export function useCausalGraphState(): CausalGraph {
	return useRecoilValue(CausalDiscoveryResultsState).graph
}
