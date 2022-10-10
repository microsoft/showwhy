/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useDimensions as useDim } from '@essex/hooks'
import { useRef } from 'react'

export function useDimensions(): {
	//eslint-disable-next-line
	ref: React.MutableRefObject<any>
	width: number
	height: number
} {
	const ref = useRef(null)
	const dimensions = useDim(ref)
	const { width = 0, height = 0 } = dimensions || {}

	return {
		ref,
		width,
		height,
	}
}
