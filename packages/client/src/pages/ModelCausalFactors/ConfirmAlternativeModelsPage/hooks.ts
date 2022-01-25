/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useXarrow } from 'react-xarrows'
import { SetterOrUpdater } from 'recoil'
import { useCausalEffects } from '~hooks'
import {
	usePrimarySpecificationConfig,
	useSetPrimarySpecificationConfig,
} from '~state'
import { PrimarySpecificationConfig } from '~types'

export function useBusinessLogic(): {
	causalEffects: ReturnType<typeof useCausalEffects>
	onXarrowChange: () => void
	setPrimarySpecificationConfig: SetterOrUpdater<PrimarySpecificationConfig>
	primarySpecificationConfig: PrimarySpecificationConfig
} {
	const updateXarrow = useXarrow()
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const causalEffects = useCausalEffects(primarySpecificationConfig.causalModel)

	return {
		causalEffects,
		onXarrowChange: updateXarrow,
		setPrimarySpecificationConfig,
		primarySpecificationConfig,
	}
}
