/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import type { CausalFactor } from '../types/causality/CausalFactor.js'
import type { Definition } from '../types/experiments/Definition.js'

export function useAllVariables(
	causalFactors: CausalFactor[],
	definitions: Definition[],
): (CausalFactor | Definition)[] {
	return useMemo((): (CausalFactor | Definition)[] => {
		return causalFactors.concat([...definitions])
	}, [causalFactors, definitions])
}
