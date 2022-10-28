/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import type { DECIParams } from '../../domain/Algorithms/DECI.js'
import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import { DeciParamsState } from '../atoms/algorithms_params.js'

export function useAlgorithmParams(
	causalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
): DECIParams | undefined {
	const deciParams = useRecoilValue(DeciParamsState)

	return useMemo((): DECIParams | undefined => {
		return causalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.DECI
			? deciParams
			: undefined
	}, [deciParams, causalDiscoveryAlgorithm])
}
