/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor, ElementDefinition, Maybe } from '@showwhy/types'
import { useEffect, useRef } from 'react'

export function useAddOnLeavePage<T extends CausalFactor | ElementDefinition>(
	value: Maybe<T>,
	add: (value: T) => void,
): void {
	const ref = useRef<T>()
	useEffect(() => {
		ref.current = value
	}, [value])
	useEffect(() => {
		return () => {
			ref?.current?.variable && add(ref.current)
		}
		// eslint-disable-next-line
	}, [])
}
