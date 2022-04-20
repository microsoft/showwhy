/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Header } from '@showwhy/components'
import { CausalFactorType } from '@showwhy/types'
import { useMemo } from 'react'

export const useHeaders = (width: number): Header[] => {
	return useMemo(() => {
		return [
			{ fieldName: 'variable', name: 'Label', width: width * 0.2 || 300 },
			{
				fieldName: CausalFactorType.CauseExposure,
				name: 'Causes Exposure',
				width: width * 0.15 || 150,
			},
			{
				fieldName: CausalFactorType.CauseOutcome,
				name: 'Causes Outcome',
				width: width * 0.15 || 150,
			},
			{ fieldName: 'reasoning', name: 'Reasoning', width: width * 0.5 || 500 },
		]
	}, [width])
}
