/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@showwhy/components'
import type { Specification } from '@showwhy/types'
import type { FC } from 'react'
import { memo } from 'react'

import { pluralize, returnFailedConfounders } from '~utils'

export const CovariateBalanceDetails: FC<{
	specification: Specification
	confounderThreshold?: number
}> = memo(function CovariateBalanceDetails({
	specification,
	confounderThreshold,
}) {
	const validated = returnFailedConfounders(specification, confounderThreshold)
	return (
		<>
			{confounderThreshold && (
				<Text>
					{validated.length > 0 &&
						` The following threshold${pluralize(validated.length)} failed: ${[
							validated.join(','),
						]}.`}
				</Text>
			)}
		</>
	)
})
