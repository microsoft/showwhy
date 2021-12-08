/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { useXarrow } from 'react-xarrows'
import { useCausalEffects } from '~hooks'
import {
	usePrimarySpecificationConfig,
	useSetPrimarySpecificationConfig,
} from '~state'
import { GenericObject } from '~types'

export const useBusinessLogic = (): GenericObject => {
	const updateXarrow = useXarrow()
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const causalEffects = useCausalEffects(primarySpecificationConfig.causalModel)
	const onXarrowChange = useCallback(() => {
		updateXarrow()
	}, [updateXarrow])

	return {
		causalEffects,
		onXarrowChange,
		setPrimarySpecificationConfig,
		primarySpecificationConfig,
	}
}
