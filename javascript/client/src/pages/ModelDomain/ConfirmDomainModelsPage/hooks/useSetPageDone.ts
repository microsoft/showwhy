/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect } from 'react'

import { useAutomaticWorkflowStatus, useCausalEffects } from '~hooks'
import { usePrimarySpecificationConfig } from '~state'

export function useSetDonePage(): void {
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const causalEffects = useCausalEffects(primarySpecificationConfig.causalModel)
	const { confounders, outcomeDeterminants, exposureDeterminants } =
		causalEffects
	const autoWorkflowStatus = useAutomaticWorkflowStatus()

	useEffect(() => {
		if (
			confounders.length ||
			outcomeDeterminants.length ||
			exposureDeterminants.length
		) {
			autoWorkflowStatus.setDone()
		} else {
			autoWorkflowStatus.setTodo()
		}
	}, [
		autoWorkflowStatus,
		confounders,
		outcomeDeterminants,
		exposureDeterminants,
	])
}
