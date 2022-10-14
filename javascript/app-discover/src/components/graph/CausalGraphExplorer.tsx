/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useEffect, useRef } from 'react'
import { useXarrow, Xwrapper } from 'react-xarrows'
import {
	useRecoilValue,
	useRecoilValueLoadable,
	useSetRecoilState,
} from 'recoil'

import type { CausalVariable } from '../../domain/CausalVariable.jsx'
import * as Graph from '../../domain/Graph.jsx'
import { hasSameOrInvertedSourceAndTarget } from '../../domain/Relationship.jsx'
import {
	ConfidenceThresholdState,
	FilteredCorrelationsState,
	GraphLayoutState,
	SelectedObjectState,
	useCausalGraph,
	WeightThresholdState,
} from '../../state/index.jsx'
import { CausalEdge } from './CausalEdge.jsx'
import { useGraphBounds } from './CausalGraphExplorer.hooks.js'
import { Background } from './CausalGraphExplorer.styles.js'
import { CausalGraphNode } from './CausalGraphNode.jsx'
import { CorrelationEdge } from './CorrelationEdge.jsx'
import { CorrelationGraphNode } from './CorrelationGraphNode.jsx'
import { DraggableGraphNode } from './DraggableNode.jsx'

const MIN_EDGE_WIDTH = 2
const MAX_EDGE_WIDTH = 10

export const CausalGraphExplorer = memo(function CausalGraphExplorer() {
	const causalGraph = useCausalGraph()
	const weightThreshold = useRecoilValue(WeightThresholdState)
	const confidenceThreshold = useRecoilValue(ConfidenceThresholdState)
	const causalRelationships = Graph.relationshipsAboveThresholds(
		causalGraph,
		weightThreshold,
		confidenceThreshold,
	)
	const setSelectedObject = useSetRecoilState(SelectedObjectState)
	const correlations =
		useRecoilValueLoadable(FilteredCorrelationsState).valueMaybe() || []

	const correlationsWithoutCausesInModel = correlations
		.filter(correlation =>
			Graph.includesVariables(causalGraph, [
				correlation.source,
				correlation.target,
			]),
		)
		// (causalGraph.variables.includes(correlation.source)
		// && causalGraph.variables.includes(correlation.target)))
		.filter(
			correlation =>
				!causalRelationships.some(relationship =>
					hasSameOrInvertedSourceAndTarget(correlation, relationship),
				),
		)
	const bounds = useGraphBounds()
	const layout = useRecoilValue(GraphLayoutState)
	const updateXarrow = useXarrow()

	const layoutTransitionTime = 1000
	const animationRequest = useRef(0)
	useEffect(() => {
		const animation = () => {
			updateXarrow()
			animationRequest.current = requestAnimationFrame(animation)
		}

		animationRequest.current = requestAnimationFrame(animation)

		setTimeout(
			() => cancelAnimationFrame(animationRequest.current),
			layoutTransitionTime,
		)
		return () => cancelAnimationFrame(animationRequest.current)
	}, [layout, updateXarrow])
	const nodes = causalGraph.variables.map((variable: CausalVariable) => (
		<DraggableGraphNode
			id={variable.columnName}
			key={variable.columnName}
			layout={layout}
			layoutTransitionTime={layoutTransitionTime}
		>
			{Graph.includesVariable(causalGraph, variable) ? (
				<CausalGraphNode variable={variable} isSelectable isRemovable />
			) : (
				<CorrelationGraphNode variable={variable} isSelectable isAddable />
			)}
		</DraggableGraphNode>
	))

	const correlationEdges = correlationsWithoutCausesInModel.map(correlation => (
		<CorrelationEdge
			correlation={correlation}
			maxEdgeWidth={MAX_EDGE_WIDTH / 2}
			minEdgeWidth={1}
			key={correlation.key}
		/>
	))

	const causalEdges = causalRelationships.map(relationship => {
		return (
			<CausalEdge
				relationship={relationship}
				key={relationship.key}
				maxEdgeWidth={MAX_EDGE_WIDTH}
				minEdgeWidth={MIN_EDGE_WIDTH}
			/>
		)
	})

	const deselect = () => setSelectedObject(undefined)

	// TODO: Figure out pan/zoom
	return (
		<>
			<Background onClick={deselect} style={bounds}></Background>
			<Xwrapper>
				{correlationEdges}
				{causalEdges}
				{nodes}
			</Xwrapper>
		</>
	)
})
