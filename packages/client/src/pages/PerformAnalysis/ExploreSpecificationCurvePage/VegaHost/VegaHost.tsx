/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// eslint-disable @typescript-eslint/no-explicit-any
import { memo, useRef, useEffect } from 'react'
import styled from 'styled-components'
import * as vega from 'vega'
import {
	DataListenerHandler,
	EventListenerHandler,
	SignalListenerHandler,
	SignalValue,
	View,
} from 'vega'
import {
	useSignalListeners,
	useSignals,
	useData,
	useDataListeners,
	useLogLevel,
	useAddClickHandler,
	useAddMouseOverHandler,
	useCreateView,
	useInitializeView,
	useOnCreateView,
	useMergeChildSpecs,
	useEventListeners,
} from './hooks'
import { LogLevel } from './types'

export interface VegaHostProps {
	spec: vega.Spec
	width: number
	height: number
	/**
	 * Callback to get a reference to the created view for this host.
	 * Most top-level View methods are available via props, but for anything
	 * that isn't covered you can grab a ref here and invoke imperatively as needed.
	 */
	onCreateView?: (view: View) => void
	// eslint-disable-next-line
	onDatumMouseOver?: (datum: any) => void
	// eslint-disable-next-line
	onDatumClick?: (datum: any) => void
	// eslint-disable-next-line
	onAxisClick?: (datum: any, axis: string) => void
	// the rest of these props thunk to methods on the underlying View
	logLevel?: LogLevel
	signals?: { [key: string]: SignalValue }
	signalListeners?: { [key: string]: SignalListenerHandler }
	// eslint-disable-next-line
	data?: { [key: string]: any[] }
	dataListeners?: { [key: string]: DataListenerHandler }
	eventListeners?: { [key: string]: EventListenerHandler }
}

export const VegaHost: React.FC<VegaHostProps> = memo(function VegaHost({
	spec,
	width,
	height,
	onCreateView,
	onDatumMouseOver,
	onDatumClick,
	onAxisClick,
	logLevel = LogLevel.None,
	signals = {},
	signalListeners = {},
	data = {},
	dataListeners = {},
	eventListeners = {},
	children,
}) {
	const ref = useRef<HTMLDivElement | null>(null)

	const merged = useMergeChildSpecs(spec, children)

	const view = useCreateView(merged, width, height)
	useInitializeView(ref, view)
	useOnCreateView(view, onCreateView)

	useAddClickHandler(view, onDatumClick, onAxisClick)
	useAddMouseOverHandler(view, onDatumMouseOver)

	useLogLevel(view, logLevel)

	useSignals(view, signals)
	useSignalListeners(view, signalListeners)

	useData(view, data)
	useDataListeners(view, dataListeners)

	useEventListeners(view, eventListeners)

	useRenderTriggers(
		view,
		signals,
		signalListeners,
		data,
		dataListeners,
		eventListeners,
	)

	return (
		<Container>
			<Chart ref={ref} />
		</Container>
	)
})

// anytime we use API elements that should trigger a re-render, we want to trigger an async run
// this batches them up add the end of the render
function useRenderTriggers(view: View, ...deps: unknown[]) {
	useEffect(() => {
		view.runAsync()
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [view, ...deps])
}

const Container = styled.div``

const Chart = styled.div``
