/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect, useState } from 'react'

export function useIntersection(
	element: HTMLDivElement | undefined,
	rootMargin: string,
): boolean {
	const [isVisible, setState] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setState(entry?.isIntersecting ?? false)
			},
			{ rootMargin },
		)
		element && observer.observe(element)

		return () => element && observer.unobserve(element)
	}, [element, rootMargin])

	return isVisible
}
