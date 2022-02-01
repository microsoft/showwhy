/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Text, Value } from '~styles'
import { AlternativeModels } from '~types'

export const CausalDetails: React.FC<{
	alternativeModels: AlternativeModels
}> = memo(function CausalDetails({ alternativeModels }) {
	return (
		<Text>
			The model includes
			<Value>{alternativeModels.confounders.length}</Value>
			confounders that may affect both exposure and outcome, and
			<Value>{alternativeModels.outcomeDeterminants.length}</Value>
			other variables that may affect outcome only.
		</Text>
	)
})
