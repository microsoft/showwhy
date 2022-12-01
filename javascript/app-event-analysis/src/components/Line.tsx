/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useMemo, useRef } from 'react'

import type { LineProps } from './Line.types.js'

export const Line: React.FC<LineProps> = memo(function Line({
	xScale,
	yScale,
	color,
	data,
	...props
}) {
	const refSolid = useRef<SVGPathElement | null>(null)
	const refDashed = useRef<SVGPathElement | null>(null)

	const missingDataExist = useMemo(() => {
		return data.some(d => d.value === null)
	}, [data])

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
