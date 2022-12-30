/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import type { DiscoverProgressCallback } from '../../api/types.js'
import type { DECIParams } from '../../domain/Algorithms/DECI.js'
import { discover } from '../../domain/CausalDiscovery/CausalDiscovery.js'
import type { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalDiscoveryNormalization } from '../../domain/CausalDiscovery/CausalDiscoveryNormalization.js'
import type { CausalVariable } from '../../domain/CausalVariable.js'
import type { Dataset } from '../../domain/Dataset.js'
import type {
	CancelLastDiscoveryResultPromise,
	SetLastDiscoveryResultPromise,
} from './useLastDiscoveryResultPromise.js'

export function useCreateDiscoveryPromise(
	setLastDiscoveryResultPromise: SetLastDiscoveryResultPromise,
	cancelLastDiscoveryResultPromise: CancelLastDiscoveryResultPromise,
) {
	return useCallback(
		(
			dataset: Dataset,
			variables: CausalVariable[],
			constraints: CausalDiscoveryConstraints,
			algorithmName: CausalDiscoveryAlgorithm,
			normalization: CausalDiscoveryNormalization,
			progressCallback?: DiscoverProgressCallback,
			paramOptions?: DECIParams,
		) => {
			// if the last task has not finished just yet, cancel it
			cancelLastDiscoveryResultPromise()

			const discoveryPromise = discover(
				dataset,
				variables,
				constraints,
				algorithmName,
				normalization,
				progressCallback,
				paramOptions,
			)

			setLastDiscoveryResultPromise(discoveryPromise)

			return discoveryPromise
		},
		[cancelLastDiscoveryResultPromise, setLastDiscoveryResultPromise],
	)
}
