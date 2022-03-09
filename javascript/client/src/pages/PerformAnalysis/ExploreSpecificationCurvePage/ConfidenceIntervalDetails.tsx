/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { round } from 'lodash'
import { memo } from 'react'

import { Text } from '~styles'

export const ConfidenceIntervalDetails: React.FC<{
	c95Lower: number
	c95Upper: number
}> = memo(function ConfidenceIntervalDetails({ c95Lower, c95Upper }) {
	return (
		<Text>
			{' '}
			(95% Confidence Interval = [{round(c95Lower, 3)}, {round(c95Upper, 3)}
			]).{' '}
		</Text>
	)
})
