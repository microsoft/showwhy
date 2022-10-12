/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRecoilValue } from 'recoil'

import {
	CausalGraphConstraintsState,
	CorrelationThresholdState,
	InModelColumnNamesState,
	WeightThresholdState,
} from '../atoms/index.js'

/**
 * This component just performs an initial access of persisted state atoms to
 * make sure they have been rehydrated before being accessed for the
 * first time. Otherwise we would sometimes see issues where default values
 * were applied *after* rehydration.
 */
export function useRehydrateRecoil() {
	useRecoilValue(InModelColumnNamesState)
	useRecoilValue(CausalGraphConstraintsState)
	useRecoilValue(WeightThresholdState)
	useRecoilValue(CorrelationThresholdState)
}
