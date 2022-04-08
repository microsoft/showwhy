/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Handler, PrimarySpecificationConfig } from '@showwhy/types'
import { useXarrow } from 'react-xarrows'
import type { SetterOrUpdater } from 'recoil'

import { useCausalEffects } from '~hooks'
import {
	usePrimarySpecificationConfig,
	useSetPrimarySpecificationConfig,
} from '~state'

import { useSetDonePage } from './useSetPageDone'

export function useBusinessLogic(): {
	causalEffects: ReturnType<typeof useCausalEffects>
	onXarrowChange: Handler
	setPrimarySpecificationConfig: SetterOrUpdater<PrimarySpecificationConfig>
	primarySpecificationConfig: PrimarySpecificationConfig
} {
	const updateXarrow = useXarrow()
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const causalEffects = useCausalEffects(primarySpecificationConfig.causalModel)
	useSetDonePage()

	return {
		causalEffects,
		onXarrowChange: updateXarrow,
		setPrimarySpecificationConfig,
		primarySpecificationConfig,
	}
}
