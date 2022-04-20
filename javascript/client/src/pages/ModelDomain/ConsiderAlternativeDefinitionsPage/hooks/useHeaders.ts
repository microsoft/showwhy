/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Header } from '@showwhy/components'
import { useMemo } from 'react'

export function useHeaders(width: number): Header[] {
	return useMemo(() => {
		return [
			{ fieldName: 'level', name: 'Level', width: width * 0.15 || 150 },
			{ fieldName: 'variable', name: 'Label', width: width * 0.35 || 350 },
			{
				fieldName: 'description',
				name: 'Description',
				width: width * 0.4 || 400,
			},
			{ fieldName: 'actions', name: 'Actions', width: width * 0.1 || 100 },
		]
	}, [width])
}
