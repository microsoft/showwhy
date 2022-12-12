/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { select } from 'd3'
import { memo, useEffect, useMemo, useRef } from 'react'

import type { LineData } from '../types.js'
import {
	useDataForPointsAtGapBounds,
	usePathDefinitionFunc,
} from './Line.hooks.js'
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
	const pathDefinitionFunc = usePathDefinitionFunc(xScale, yScale)
	const dataForPointsAtGapBounds = useDataForPointsAtGapBounds(data)

	const missingDataExist = useMemo(() => {
		return data.some(d => d.value === null)
	}, [data])

	function renderLine() {
		if (refSolid?.current) {
			select<SVGPathElement, LineData[]>(refSolid.current)
				.datum(data)
				.attr('d', pathDefinitionFunc)
				.attr('stroke', color)
		}
		if (refDashed?.current) {
			select<SVGPathElement, LineData[]>(refDashed.current)
				.datum(dataForPointsAtGapBounds)
				.attr('d', pathDefinitionFunc)
				.attr('stroke', color)
				.style('stroke-dasharray', '3, 3')
		}
	}

	useEffect(() => {
		renderLine()
	}, [
		data,
		refSolid,
		refDashed,
		dataForPointsAtGapBounds,
		pathDefinitionFunc,
		color,
	])

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
