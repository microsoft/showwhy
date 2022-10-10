/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, DefaultValue, selector, selectorFamily } from 'recoil'
import { recoilPersist } from 'recoil-persist'

import type { NodePosition } from '../domain/NodePosition.js'
import { layoutGraph } from '../utils/Layout.js'
import { CausalGraphState } from './CausalGraphState.js'
import { persistAtomEffect } from './PersistentInfoState.js'
import {
	AutoLayoutEnabledState,
	ConfidenceThresholdState,
	WeightThresholdState,
} from './UIState.js'

const { persistAtom } = recoilPersist()

export const NodePositionsState = atom<{ [key: string]: NodePosition }>({
	key: 'NodePositionState',
	default: {},
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const GraphLayoutState = selector({
	key: 'GraphLayoutState',
	async get({ get }) {
		const isAutoLayotEnabled = get(AutoLayoutEnabledState)
		if (isAutoLayotEnabled) {
			const causalGraph = get(CausalGraphState)
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

export const GraphBoundsState = selector<{ width: number; height: number }>({
	key: 'GraphBoundsState',
	get({ get }) {
		const nodePositions = get(NodePositionsState)
		const width = Math.max(
			...Object.values(nodePositions).map(
				nodePosition => nodePosition.right ?? 0,
			),
		)
		const height = Math.max(
			...Object.values(nodePositions).map(
				nodePosition => nodePosition.bottom ?? 0,
			),
		)
		return { width, height }
	},
})
