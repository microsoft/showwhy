/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { RefutationType } from '~interfaces'
import { Text, Value } from '~styles'

interface AnalysisSpecificationsProps {
	specificationLength: number
	refutationLength: number
	refutationType: RefutationType
}
export const AnalysisSpecifications: React.FC<AnalysisSpecificationsProps> =
	memo(function AnalysisSpecifications({
		specificationLength,
		refutationLength,
		refutationType,
	}) {
		return (
			<Text>
				<Value>{specificationLength}</Value>
				alternative specifications were estimated, each of them was validated
				against<Value>{refutationLength}</Value>
				refutation tests, using the
				<Value>
					{refutationType === RefutationType.QuickRefutation
						? ' Quick '
						: ' Full '}
					Refutation
				</Value>
				mode.
			</Text>
		)
	})
