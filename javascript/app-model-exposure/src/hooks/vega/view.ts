/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { vega as decorator } from '@thematic/vega'
import { useEffect, useMemo } from 'react'
import type { Spec } from 'vega'
import { parse, View } from 'vega'

export function useCreateView(spec: Spec, width: number, height: number): View {
	const theme = useThematic()
	return useMemo(() => {
		// TODO: width and height should be optional with modern vega
		const themed = decorator(theme, spec, { width, height })
		const parsed = parse(themed)
		return new View(parsed).renderer('svg')
	}, [theme, spec, width, height])
}

export function useInitializeView(
	ref: React.MutableRefObject<HTMLDivElement | null>,
	view: View,
): void {
	useEffect(() => {
		if (ref?.current !== null) {
			// eslint-disable-next-line
			view.initialize(ref.current as any).run()
		}
	}, [ref, view])
}

export function useOnCreateView(
	view: View,
	onCreateView?: (view: View) => void,
): void {
	useEffect(() => {
		onCreateView?.(view)
	}, [view, onCreateView])
}
