/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { round } from 'lodash'
import { memo } from 'react'

import { Text } from '~styles'

export const EstimateDetails: React.FC<{
	populationSize: number
	c95Lower: number | null
	c95Upper: number | null
}> = memo(function EstimateDetails({ c95Lower, c95Upper, populationSize }) {
	return (
		<Text>
			{' ('}
			{c95Lower &&
				c95Upper &&
				`95% Confidence Interval = [${round(c95Lower, 3)}, ${round(
					c95Upper,
					3,
				)}], `}
			{`Population Size = ${populationSize}). `}
		</Text>
	)
})
