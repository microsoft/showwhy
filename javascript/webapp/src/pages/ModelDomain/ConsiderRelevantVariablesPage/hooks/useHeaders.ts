/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Header } from '@showwhy/components'
import { useMemo } from 'react'

export function useHeaders(width: number): Header[] {
	return useMemo((): any => {
		return [
			{ fieldName: 'variable', name: 'Label', width: width * 0.3 || 400 },
			{
				fieldName: 'description',
				name: 'Description',
				width: width * 0.6 || 650,
			},
			{ fieldName: 'actions', name: 'Actions', width: width * 0.1 || 200 },
		]
	}, [width])
}
