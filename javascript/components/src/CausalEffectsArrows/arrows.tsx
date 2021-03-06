/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { useThematic } from '@thematic/react'
import { useCallback } from 'react'
import Xarrow from 'react-xarrows'
import styled from 'styled-components'

import { arrows, CausalEffectSize } from './CausalEffectsArrows.constants.js'

export function useGetArrows(size: CausalEffectSize): Handler<JSX.Element[]> {
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
					headSize={size === CausalEffectSize.Small ? 6 : 9}
					strokeWidth={size === CausalEffectSize.Small ? 1 : 2}
				/>
			)
		})
	}, [size, thematic])
}

const ArrowLabel = styled.span<{ size: CausalEffectSize; color?: string }>`
	font-weight: bold;
	font-size: ${({ size }) =>
		size === CausalEffectSize.Small ? '12px' : '14px'};
	padding: 0 ${({ color }) => (!!color ? '4px' : '')};
	color: ${({ color }) => color};
	background-color: white;
`
