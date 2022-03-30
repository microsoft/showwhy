/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CausalEffectSize } from '@showwhy/types'
import { memo } from 'react'

import { Container } from '~styles'

import { ComponentArrows } from './ComponentArrows'

export const CausalEffects: React.FC<{
	size?: CausalEffectSize
	confounders: string[]
	outcomeDeterminants: string[]
	generalExposure: string
	generalOutcome: string
}> = memo(function CausalEffects({
	size = CausalEffectSize.Medium,
	confounders,
	outcomeDeterminants,
	generalExposure,
	generalOutcome,
}) {
	return (
		<Container>
			<ComponentArrows
				size={size}
				confounders={confounders}
				outcomeDeterminants={outcomeDeterminants}
				exposure={generalExposure}
				outcome={generalOutcome}
			/>
		</Container>
	)
})
