/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { memo, useEffect, useRef } from 'react'

import type { DrawingContainerProps } from './DrawingContainer.types.js'

export const DrawingContainer: React.FC<
	React.PropsWithChildren<DrawingContainerProps>
> = memo(function DrawingContainer({
	width,
	height,
	margin = DEFAULT_MARGIN,
	className = 'chart',
	children,
	refLine = false,
	handleClickOutside,
	handleContainerClick,
}) {
	const theme = useThematic()
	const svgWidth = width + margin.left + margin.right
	const svgHeight = height + margin.top + margin.bottom

	const ref = useRef<SVGSVGElement>(null)

	const handleDocumentClick = (event: MouseEvent) => {
		if (
			ref.current &&
			event.target instanceof Node &&
			!ref.current.contains(event.target)
		) {
			handleClickOutside()
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleDocumentClick, true)
		return () => {
			document.removeEventListener('click', handleDocumentClick, true)
		}
	}, [])

	useEffect(() => {
		if (refLine) {
			const svg = ref?.current
			const path = svg?.querySelector('path.domain') as any
			const d = path?.getAttribute('d') || ''
			const height = parseFloat(d.split(',')[1]?.split('H')[0])
			if (svg && !isNaN(height)) {
				const rl = svg.querySelector('.reference-line')
				rl?.remove()
				const line = document.createElementNS(
					'http://www.w3.org/2000/svg',
					'line',
				)
				const halfHeight = `${height / 2}`
				line.setAttributeNS(null, 'class', 'reference-line')
				line.setAttributeNS(null, 'stroke', theme.line().stroke().hex())
				line.setAttributeNS(null, 'stroke-width', '0.2')
				line.setAttributeNS(null, 'x1', '0')
				line.setAttributeNS(null, 'y1', halfHeight)
				line.setAttributeNS(null, 'x2', `${width}`)
				line.setAttributeNS(null, 'y2', halfHeight)
				svg.querySelector('g')?.appendChild(line)
			}
		}
	}, [theme, refLine, width])

	return (
		<svg
			ref={ref}
			className={className}
			width={svgWidth}
			height={svgHeight}
			onClick={handleContainerClick}
		>
			<g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
		</svg>
	)
})

const DEFAULT_MARGIN = { top: 0, bottom: 0, right: 0, left: 0 }
