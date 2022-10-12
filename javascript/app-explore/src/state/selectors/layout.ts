/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultValue, selector, selectorFamily } from 'recoil'

import type { NodePosition } from '../../domain/NodePosition.js'
import { layoutGraph } from '../../utils/Layout.js'
import {
	AutoLayoutEnabledState,
	CausalDiscoveryResultsState,
	ConfidenceThresholdState,
	NodePositionsState,
	WeightThresholdState,
} from '../atoms/index.js'

export const GraphLayoutState = selector({
	key: 'GraphLayoutState',
	async get({ get }) {
		const isAutoLayotEnabled = get(AutoLayoutEnabledState)
		if (isAutoLayotEnabled) {
			const causalGraph = get(CausalDiscoveryResultsState).graph
			const weightThreshold = get(WeightThresholdState)
			const confidenceThreshold = get(ConfidenceThresholdState)
			const elkLayout = await layoutGraph(
				causalGraph,
				weightThreshold,
				confidenceThreshold,
			)
			return elkLayout
		}
	},
})

export const graphLayoutPositionFamily = selectorFamily({
	key: 'NodePositionStateFamily',
	get:
		id =>
		({ get }) => {
			const layout = get(GraphLayoutState)
			const layoutNode = layout?.children?.find(node => node.id === id)
			return { x: layoutNode?.x ?? 0, y: layoutNode?.y ?? 0 }
		},
})

export const nodePositionsFamily = selectorFamily<NodePosition, string>({
	key: 'nodePositionsFamily',
	get:
		id =>
		({ get }) => {
			const nodePositions = get(NodePositionsState)
			return nodePositions[id] ?? { x: 0, y: 0 }
		},
	set:
		id =>
		({ set, get, reset }, nodePosition) => {
			if (!nodePosition) {
				return
			}

			if (nodePosition instanceof DefaultValue) {
				reset(NodePositionsState)
				return
			}

			const nodePositions = get(NodePositionsState)
			const newNodePositions = { ...nodePositions }
			newNodePositions[id] = nodePosition
			set(NodePositionsState, newNodePositions)
		},
})
