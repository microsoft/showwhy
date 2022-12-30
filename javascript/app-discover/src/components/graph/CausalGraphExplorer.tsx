/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useEffect, useRef } from 'react'
import { useXarrow, Xwrapper } from 'react-xarrows'
import {
	useRecoilState,
	useRecoilValue,
	useRecoilValueLoadable,
	useSetRecoilState,
} from 'recoil'

import type { CausalVariable } from '../../domain/CausalVariable.jsx'
import * as Graph from '../../domain/Graph.jsx'
import { hasSameOrInvertedSourceAndTarget } from '../../domain/Relationship.jsx'
import {
	AutoLayoutState,
	CausalDiscoveryResultsState,
	ConfidenceThresholdState,
	CurrentLayoutState,
	FilteredCorrelationsState,
	FixedInterventionRangesEnabledState,
	SelectedObjectState,
	useCausalGraph,
	WeightThresholdState,
} from '../../state/index.jsx'
import { CausalEdge } from './CausalEdge.jsx'
import { useGraphBounds } from './CausalGraphExplorer.hooks.js'
import {
	Background,
	Container,
	ContainerEdge,
	edgeColors,
	FlexContainer,
	Grid,
} from './CausalGraphExplorer.styles.js'
import { CausalGraphNode } from './CausalGraphNode.jsx'
import { CorrelationEdge } from './CorrelationEdge.jsx'
import { CorrelationGraphNode } from './CorrelationGraphNode.jsx'
import { DraggableGraphNode } from './DraggableNode.jsx'
import { CorrelationIcon, EdgeIcon } from './LegendIcons.js'

const MIN_EDGE_WIDTH = 2
const MAX_EDGE_WIDTH = 10

export const CausalGraphExplorer: React.FC<{
	width: number
	height: number
}> = memo(function CausalGraphExplorer({ width, height }) {
	const causalGraph = useCausalGraph()
	const useFixedInterventionRanges = useRecoilValue(
		FixedInterventionRangesEnabledState,
	)
	const columnsMetadata = useRecoilValue(
		CausalDiscoveryResultsState,
	).normalizedColumnsMetadata

	const weightThreshold = useRecoilValue(WeightThresholdState)
	const autoLayout = useRecoilValue(AutoLayoutState)
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
	const [currentLayout, setCurrentLayout] = useRecoilState(CurrentLayoutState)
	const updateXarrow = useXarrow()
	const layoutTransitionTime = 1000
	const animationRequest = useRef(0)
	const legendRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!autoLayout && currentLayout) {
			setCurrentLayout(undefined)
		}
	}, [autoLayout, currentLayout, setCurrentLayout])

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
	}, [currentLayout, updateXarrow])
	const nodes = causalGraph.variables.map((variable: CausalVariable) => (
		<DraggableGraphNode
			id={variable.columnName}
			key={variable.columnName}
			layout={currentLayout}
			layoutTransitionTime={layoutTransitionTime}
		>
			{Graph.includesVariable(causalGraph, variable) ? (
				<CausalGraphNode
					columnsMetadata={columnsMetadata}
					variable={variable}
					useFixedInterventionRanges={useFixedInterventionRanges}
					isSelectable
					isRemovable
				/>
			) : (
				<CorrelationGraphNode
					variable={variable}
					useFixedInterventionRanges={useFixedInterventionRanges}
					isSelectable
					isAddable
				/>
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

	const legendHeight = legendRef?.current?.clientHeight ?? 0

	// TODO: Figure out pan/zoom
	return (
		<>
			<div
				style={{
					width,
					height: height - legendHeight,
					position: 'relative',
					top: '10px',
					overflow: 'auto',
				}}
			>
				<Background onClick={deselect} style={bounds} />
				<Xwrapper>
					{correlationEdges}
					{causalEdges}
					{nodes}
				</Xwrapper>
			</div>
			<FlexContainer ref={legendRef}>
				<Grid>
					<Container>
						<CorrelationIcon color={edgeColors.correlation} />
						Correlation
					</Container>
					<Container>
						<EdgeIcon color={edgeColors.positive} /> Causes increase
					</Container>
					<Container>
						<EdgeIcon color={edgeColors.negative} />
						Causes decrease
					</Container>
					<Container>
						<EdgeIcon color={edgeColors.pcChange} />
						Causes change
					</Container>
					<ContainerEdge>
						Edge weights quantify the strength of the causal relationship under
						the selected discovery algorithm. corr=correlation; conf=confidence
					</ContainerEdge>
				</Grid>
			</FlexContainer>
		</>
	)
})
