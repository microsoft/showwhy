/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect } from 'react'
import type { EventListenerHandler, View } from 'vega'
/* eslint-disable */

export function useAddClickHandler(
	view: View,
	onDatumClick?: (datum: any) => void,
	onAxisClick?: (datum: any, axis: string) => void,
): void {
	const handleClick = useCallback(
		(_e: any, item: any) => {
			const { datum, mark } = item
			if (mark.role.includes('axis')) {
				const axis = item.align === 'left' || item.align === 'right' ? 'y' : 'x'
				onAxisClick && onAxisClick(datum, axis)
			} else {
				onDatumClick && onDatumClick(datum)
			}
		},
		[onDatumClick, onAxisClick],
	)
	useEffect(() => {
		view.addEventListener('click', handleClick)
		return () => {
			view.removeEventListener('click', handleClick)
		}
	}, [view, handleClick])
}

export function useAddMouseOverHandler(
	view: View,
	onDatumMouseOver?: (datum: any) => void,
): void {
	const handleMouseOver = useCallback(
		(_e: any, item: any) => {
			const { datum } = item
			onDatumMouseOver && onDatumMouseOver(datum)
		},
		[onDatumMouseOver],
	)
	useEffect(() => {
		view.addEventListener('mouseover', handleMouseOver)
		return () => {
			view.removeEventListener('mouseover', handleMouseOver)
		}
	}, [view, handleMouseOver])
}

export function useEventListeners(
	view: View,
	listeners: { [key: string]: EventListenerHandler },
): void {
	useEffect(() => {
		Object.entries(listeners).forEach(([name, value]) => {
			view.addEventListener(name, value)
		})
		return () => {
			if (view) {
				Object.entries(listeners).forEach(([name, value]) => {
					view.removeEventListener(name, value)
				})
			}
		}
	}, [view, listeners])
}
