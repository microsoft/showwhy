/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import type { AlgorithmParams } from '../../domain/Algorithms/AlgorithmParams.js'
import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import {
	DeciParamsState,
	NotearsParamsState,
	PCParamsState,
} from '../atoms/algorithms_params.js'

export function useAlgorithmParams(
	causalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
): AlgorithmParams | undefined {
	const notearsParams = useRecoilValue(NotearsParamsState)
	const deciParams = useRecoilValue(DeciParamsState)
	const pcParams = useRecoilValue(PCParamsState)

	return useMemo((): AlgorithmParams | undefined => {
		if (causalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.NOTEARS) {
			return notearsParams
		} else if (causalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.DECI) {
			return deciParams
		} else if (causalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.PC) {
			return pcParams
		}
		return undefined
	}, [notearsParams, deciParams, pcParams, causalDiscoveryAlgorithm])
}
