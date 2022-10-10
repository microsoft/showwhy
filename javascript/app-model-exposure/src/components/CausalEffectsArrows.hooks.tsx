/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { useCallback, useEffect } from 'react'
import Xarrow, { useXarrow } from 'react-xarrows'

import type { Handler } from '../types/primitives.js'
import { arrows, CausalEffectSize } from './CausalEffectsArrows.constants.js'
import { ArrowLabel } from './CausalEffectsArrows.styles.js'

export function useGetArrows(
	size: CausalEffectSize,
	width: number,
): Handler<JSX.Element[]> {
	const thematic = useThematic()
	const updateXarrow = useXarrow()

	useEffect(() => {
		updateXarrow()
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [width])
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
