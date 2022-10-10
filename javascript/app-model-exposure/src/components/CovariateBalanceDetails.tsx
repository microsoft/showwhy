/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'

import type { Specification } from '../types/visualization/Specification.js'
import { pluralize } from '../utils/lang.js'
import { returnFailedConfounders } from '../utils/specificationCurveManagement.js'
import { Text } from './styles.js'

export const CovariateBalanceDetails: FC<{
	specification: Specification
	confounderThreshold?: number
}> = memo(function CovariateBalanceDetails({
	specification,
	confounderThreshold,
}) {
	const validated = returnFailedConfounders(specification, confounderThreshold)
	const length = validated.length
	return (
		<>
			{confounderThreshold && (
				<Text>
					{length > 0 && //eslint-disable-next-line
						` The following threshold${pluralize(length)} failed: ${[
							validated.join(','),
						]}.`}
				</Text>
			)}
		</>
	)
})
