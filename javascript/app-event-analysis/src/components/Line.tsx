/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useEffect, useMemo, useRef } from 'react'

import { useAnimate } from './Line.hooks.js'
import type { LineProps } from './Line.types.js'

export const Line: React.FC<LineProps> = memo(function Line({
	xScale,
	yScale,
	color,
	data,
	animation,
	...props
}) {
	const refSolid = useRef<SVGPathElement | null>(null)
	const refDashed = useRef<SVGPathElement | null>(null)

	const missingDataExist = useMemo(() => {
		return data.some(d => d.value === null)
	}, [data])

	const animateLine = useAnimate({
		color,
		data,
		refDashed,
		refSolid,
		xScale,
		yScale,
	})

	useEffect(() => {
		animateLine(animation)
	}, [animation, animateLine])

	if (missingDataExist) {
		return (
			<g>
				<path ref={refSolid} fill="none" {...props} />
				<path ref={refDashed} fill="none" {...props} />
			</g>
		)
	} else {
		return <path ref={refSolid} fill="none" {...props} />
	}
})
