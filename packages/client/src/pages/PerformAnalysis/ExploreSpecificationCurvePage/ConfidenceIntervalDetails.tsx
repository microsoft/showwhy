/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { round } from 'lodash'
import React, { memo } from 'react'
import { Text } from '~styles'

interface ConfidenceIntervalDetailsProps {
	c95Lower: number
	c95Upper: number
}

export const ConfidenceIntervalDetails: React.FC<ConfidenceIntervalDetailsProps> =
	memo(function ConfidenceIntervalDetails({ c95Lower, c95Upper }) {
		return (
			<Text>
				{' '}
				(95% Confidence Interval = [{round(c95Lower, 3)}, {round(c95Upper, 3)}
				]).{' '}
			</Text>
		)
	})
