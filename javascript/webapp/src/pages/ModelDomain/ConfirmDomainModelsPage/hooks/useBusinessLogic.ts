/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RadioButtonChoice } from '@showwhy/components'
import type { PrimarySpecificationConfig } from '@showwhy/types'
import { CausalModelLevel } from '@showwhy/types'
import { useCallback } from 'react'
import { useXarrow } from 'react-xarrows'

import type { CausalEffectsProps } from '~hooks'
import { useCausalEffects } from '~hooks'
import {
	usePrimarySpecificationConfig,
	useSetPrimarySpecificationConfig,
} from '~state'

import { useSetPageDone } from './useSetPageDone'

export function useBusinessLogic(): {
	causalEffects: CausalEffectsProps
	primarySpecificationConfig: PrimarySpecificationConfig
	onDefaultChange: (option?: RadioButtonChoice) => void
} {
	const updateXarrow = useXarrow()
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const causalEffects = useCausalEffects(primarySpecificationConfig.causalModel)
	useSetPageDone()

	const onDefaultChange = useCallback(
		(option?: RadioButtonChoice) => {
			updateXarrow()
			setPrimarySpecificationConfig({
				...primarySpecificationConfig,
				causalModel:
					(option && (option?.key as CausalModelLevel)) ||
					CausalModelLevel.Maximum,
			})
		},
		[updateXarrow, setPrimarySpecificationConfig, primarySpecificationConfig],
	)

	return {
		causalEffects,
		onDefaultChange,
		primarySpecificationConfig,
	}
}
