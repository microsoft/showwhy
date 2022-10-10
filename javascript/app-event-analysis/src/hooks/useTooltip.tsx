/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useRef, useState } from 'react'

export const useTooltip = () => {
	const [x, setX] = useState(0)
	const [y, setY] = useState(0)
	const [content, setContent] = useState('')
	const [unit, setUnit] = useState('')
	const [visible, setVisible] = useState(false)
	const isSticky = useRef(false)
	const [stickyState, setStickyState] = useState(isSticky.current)

	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	const show = useCallback(
		(
			contentEl: any,
			xPos: number,
			yPos: number,
			options: {
				force: boolean
				unit: string
			} = { force: false, unit: '' },
		) => {
			if (!isSticky.current || options.force) {
				setX(xPos)
				setY(yPos)
				/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
				setContent(contentEl)
				setUnit(options.unit)
				setVisible(true)
			}
		},
		[],
	)

	const hide = useCallback((force = false) => {
		if (!isSticky.current || force) {
			setVisible(false)
		}
	}, [])

	const stick = useCallback(() => {
		isSticky.current = true
		setStickyState(isSticky.current)
	}, [])

	const unStick = useCallback(() => {
		isSticky.current = false
		setStickyState(isSticky.current)
	}, [])

	return {
		x,
		y,
		unit,
		show,
		hide,
		stick,
		unStick,
		stickyState,
		visible,
		content,
	}
}
