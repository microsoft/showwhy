/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon, Text } from '@fluentui/react'
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
	classNames,
	Container,
	ContainerEdge,
	FlexContainer,
	Grid,
} from './CausalGraphExplorer.styles.js'
import { CausalGraphNode } from './CausalGraphNode.jsx'
import { CorrelationEdge } from './CorrelationEdge.jsx'
import { CorrelationGraphNode } from './CorrelationGraphNode.jsx'
import { DraggableGraphNode } from './DraggableNode.jsx'

const MIN_EDGE_WIDTH = 2
const MAX_EDGE_WIDTH = 10

export const CausalGraphExplorer = memo(function CausalGraphExplorer() {
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

	// TODO: Figure out pan/zoom
	return (
		<>
			<Background onClick={deselect} style={bounds}>
				{!!nodes.length && (
					<FlexContainer>
						<Grid>
							<Container>
								<Icon
									className={classNames.positive}
									iconName={relationshipIcon}
								></Icon>{' '}
								Causes increase
							</Container>
							<Container>
								<Icon
									className={classNames.negative}
									iconName={relationshipIcon}
								></Icon>{' '}
								Causes decrease
							</Container>
							<Container>
								<CorrelationIcon />
								Correlation
							</Container>
							<Container>
								<Icon
									className={classNames.pcChange}
									iconName={relationshipIcon}
								></Icon>{' '}
								Causes change
							</Container>
							<Container>
								<Text variant={'xSmall'}>corr=</Text>
								Correlation value
							</Container>
							<Container>
								<Icon className={classNames.pcChange} iconName={arrow}></Icon>{' '}
								Causation direction (caused by)
							</Container>
							<ContainerEdge>
								<Text style={{ fontWeight: 'bold' }} variant={'xSmall'}>
									1.00
								</Text>{' '}
								Edge weights quantify the strength of the causal relationship
								under the selected discovery algorithm
							</ContainerEdge>
						</Grid>
					</FlexContainer>
				)}
			</Background>
			<Xwrapper>
				{correlationEdges}
				{causalEdges}
				{nodes}
			</Xwrapper>
		</>
	)
})

const relationshipIcon = 'ChromeMinimize'
const arrow = 'Forward'

const CorrelationIcon: React.FC = memo(function CausalGraphExplorer() {
	return (
		<svg
			style={{
				rotate: '45deg',
				color: classNames.correlation,
			}}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M21.785 2.2226C22.0779 2.51549 22.0779 2.99037 21.785 3.28326L20.7842 4.28407C20.4913 4.57696 20.0165 4.57696 19.7236 4.28407C19.4307 3.99118 19.4307 3.5163 19.7236 3.22341L20.7244 2.2226C21.0173 1.92971 21.4922 1.92971 21.785 2.2226ZM17.7774 6.2226C18.0703 6.51549 18.0703 6.99037 17.7774 7.28326L16.2774 8.78326C15.9845 9.07615 15.5096 9.07615 15.2167 8.78326C14.9238 8.49037 14.9238 8.01549 15.2167 7.7226L16.7167 6.2226C17.0096 5.92971 17.4845 5.92971 17.7774 6.2226ZM13.2803 10.7197C13.5732 11.0126 13.5732 11.4874 13.2803 11.7803L11.7803 13.2803C11.4874 13.5732 11.0126 13.5732 10.7197 13.2803C10.4268 12.9874 10.4268 12.5126 10.7197 12.2197L12.2197 10.7197C12.5126 10.4268 12.9874 10.4268 13.2803 10.7197ZM8.7774 16.2833C9.07029 15.9904 9.07029 15.5155 8.7774 15.2226C8.48451 14.9297 8.00963 14.9297 7.71674 15.2226L6.21674 16.7226C5.92385 17.0155 5.92385 17.4904 6.21674 17.7833C6.50963 18.0762 6.98451 18.0762 7.2774 17.7833L8.7774 16.2833ZM4.28114 20.7803C4.57403 20.4874 4.57403 20.0126 4.28114 19.7197C3.98825 19.4268 3.51337 19.4268 3.22048 19.7197L2.21967 20.7205C1.92678 21.0134 1.92678 21.4882 2.21967 21.7811C2.51256 22.074 2.98744 22.074 3.28033 21.7811L4.28114 20.7803Z"
				fill="currentColor"
			/>
		</svg>
	)
})
