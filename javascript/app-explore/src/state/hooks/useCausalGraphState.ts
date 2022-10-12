/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRecoilValue } from 'recoil'

import type { CausalGraph } from '../../domain/Graph.js'
import { CausalDiscoveryResultsState } from '../atoms/causal_graph.js'

export function useCausalGraphState(): CausalGraph {
	const results = useRecoilValue(CausalDiscoveryResultsState)
	return results.graph
}
