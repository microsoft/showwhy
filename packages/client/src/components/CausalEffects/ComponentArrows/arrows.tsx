/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { useCallback } from 'react'
import Xarrow from 'react-xarrows'
import styled from 'styled-components'
import { box1, box2, box3, box4 } from './constants'
import { Size } from '~enums'

export const arrows = [
	{
		start: box1.id,
		end: box3.id,
	},
	{
		start: box1.id,
		end: box4.id,
	},
	{
		start: box2.id,
		end: box4.id,
	},
	{
		start: box3.id,
		end: box4.id,
		color: 'cornflowerblue',
	},
]

export const useGetArrows = (size: Size): (() => JSX.Element[]) => {
	const thematic = useThematic()
	return useCallback(() => {
		return arrows.map(arrow => {
			const { color = thematic.application().border().hex(), ...props } = arrow
			return (
				<Xarrow
					key={arrow.start + arrow.end}
					{...props}
					color={color}
					labels={{
						middle: (
							<ArrowLabel size={size} color={color}>
								Causes
							</ArrowLabel>
						),
					}}
					headSize={size === Size.Small ? 6 : 9}
					strokeWidth={size === Size.Small ? 1 : 2}
				/>
			)
		})
	}, [size, thematic])
}

const ArrowLabel = styled.span<{ size: Size; color?: string }>`
	font-weight: bold;
	font-size: ${({ size }) => (size === Size.Small ? '12px' : '14px')};
	padding: 0 ${({ color }) => (!!color ? '4px' : '')};
	color: ${({ color }) => color};
	background-color: white;
`
