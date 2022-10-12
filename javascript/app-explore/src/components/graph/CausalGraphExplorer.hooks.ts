/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { NodePositionsState } from '../../state/index.js'

export function useGraphBounds(): { width: number; height: number } {
	const positions = useRecoilValue(NodePositionsState)
	return useMemo<{ width: number; height: number }>(() => {
		const width = Math.max(
			...Object.values(positions).map(pos => pos.right ?? 0),
		)
		const height = Math.max(
			...Object.values(positions).map(pos => pos.bottom ?? 0),
		)
		return { width, height }
	}, [positions])
}
