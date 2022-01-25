/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { AlternativeModels } from '~interfaces'
import { Text, Value } from '~styles'

interface CausalDetailsProps {
	alternativeModels: AlternativeModels
}

export const CausalDetails: React.FC<CausalDetailsProps> = memo(
	function CausalDetails({ alternativeModels }) {
		return (
			<Text>
				The model includes
				<Value>{alternativeModels.confounders.length}</Value>
				confounders that may affect both exposure and outcome, and
				<Value>{alternativeModels.outcomeDeterminants.length}</Value>
				other variables that may affect outcome only.
			</Text>
		)
	},
)
