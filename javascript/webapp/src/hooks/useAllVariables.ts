/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FactorsOrDefinitions } from '@showwhy/types'
import { useMemo } from 'react'

import { useCausalFactors, useDefinitions } from '../state'

export function useAllVariables(): FactorsOrDefinitions {
	const causalFactors = useCausalFactors()
	const definitions = useDefinitions()
	return useMemo((): FactorsOrDefinitions => {
		return causalFactors.concat([...definitions])
	}, [causalFactors, definitions])
}
