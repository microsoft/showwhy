/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import type { ForceGraphMethods, NodeObject } from 'react-force-graph-3d'
import ForceGraph3D from 'react-force-graph-3d'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import SpriteText from 'three-spritetext'

import { variableForColumnName } from '../../domain/Dataset.js'
import type { Relationship } from '../../domain/Relationship.js'
import {
	InModelColumnNamesState,
	DatasetState,
	SelectedObjectState,
} from '../../state/index.js'
import type {
	NetworkGraphLink,
	NetworkGraphNode,
	NetworkGraphProps,
} from './NetworkGraphExplorer.types.js'

export const NetworkGraphExplorer: React.FC<NetworkGraphProps> = memo(
	function NetworkGraphExplorer({ correlations, width, height, is3D = true }) {
		const inModelColumnNames = useRecoilValue(InModelColumnNamesState)
		const setSelectedObject = useSetRecoilState(SelectedObjectState)
		const dataset = useRecoilValue(DatasetState)
		const [nodes, setNodes] = useState<NetworkGraphNode[]>([])
		const [links, setLinks] = useState<NetworkGraphLink[]>([])

		useEffect(() => {
			const newVarIds = Array.from(
				correlations.reduce((acc, correlation: Relationship) => {
					acc.add(correlation.source.columnName)
					acc.add(correlation.target.columnName)
					return acc
				}, new Set<string>()),
			)
			const unchangedNodes = nodes.filter(oldNode =>
				newVarIds.includes(oldNode.id),
			)
			const addedVars = newVarIds.filter(
				newVarId => !nodes.some(oldNode => newVarId === oldNode.id),
			)
			const addedNodes = addedVars.map(variableId => ({
				id: variableId,
				name: variableForColumnName(dataset, variableId)?.name ?? variableId,
			}))
			if (addedNodes.length > 0) {
				const newNodes = [...unchangedNodes, ...addedNodes]
				setNodes(newNodes)
			}
		}, [correlations, dataset, nodes])

		useEffect(() => {
			const newLinks = correlations.map(correlation => ({
				source: correlation.source.columnName,
				target: correlation.target.columnName,
				value: correlation.weight || 0,
			}))
			setLinks(newLinks)
		}, [correlations])
		const forceGraphRef = useRef<ForceGraphMethods>()

		const handleNodeClick = useCallback(
			(node: NodeObject) => {
				setSelectedObject(variableForColumnName(dataset, node.id as string))
			},
			[dataset, setSelectedObject],
		)

		const handleNodeRightClick = useCallback(
			(node: NodeObject) => {
				// setInModelColumnNames([...inModelColumnNames, node.id as string]), [forceGraphRef]);
				// Aim at node from outside it

				const distance = 400
				const nodeCoords = { x: node.x ?? 0, y: node.y ?? 0, z: node.z ?? 0 }
				const distRatio =
					1 +
					distance /
						(Math.hypot(nodeCoords.x, nodeCoords.y, nodeCoords.z) || 0.1)

				if (forceGraphRef.current !== undefined) {
					const forceGraph = forceGraphRef.current
					forceGraph.cameraPosition(
						{
							x: nodeCoords.x * distRatio,
							y: nodeCoords.y * distRatio,
							z: nodeCoords.z * distRatio,
						}, // new position
						nodeCoords, // lookAt ({ x, y, z })
						300, // ms transition duration
					)
				}
			},
			[forceGraphRef],
		)

		const stopForces = useCallback(() => {
			nodes.forEach(node => {
				node.fx = node.x
				node.fy = node.y
				node.fz = node.z
			})
		}, [nodes])

		// useEffect(() => {
		// 	forceGraphRef.current?.d3Force('charge').distanceMax(1); // calibrate this value to your case
		// }, []);

		return (
			<div style={{ overflow: 'hidden' }}>
				{is3D ? (
					<ForceGraph3D
						ref={forceGraphRef}
						graphData={{ nodes, links }}
						width={width}
						height={height}
						backgroundColor={'#FFF'}
						linkWidth={link => 5 * Math.abs((link as NetworkGraphLink).value)}
						linkColor={link =>
							`rgba(0,0,0,${Math.abs((link as NetworkGraphLink).value)})`
						}
						linkOpacity={1}
						nodeThreeObject={(node: NetworkGraphNode) => {
							const sprite = new SpriteText(node.name)
							const isInModel = inModelColumnNames.includes(node.id)
							sprite.fontWeight = isInModel ? 'bold' : 'normal'
							sprite.color = isInModel ? '#000000ff' : '#00000066'
							sprite.textHeight = 5
							return sprite
						}}
						onNodeClick={handleNodeClick}
						onNodeRightClick={handleNodeRightClick}
						cooldownTime={2000}
						onEngineStop={stopForces}
					/>
				) : (
					<ForceGraph2D
						graphData={{ nodes, links }}
						width={width}
						height={height}
						d3VelocityDecay={0.5}
						linkWidth={link => 5 * Math.abs((link as NetworkGraphLink).value)}
						linkColor={link =>
							`rgba(0,0,0,${Math.abs((link as NetworkGraphLink).value)})`
						}
						onNodeClick={handleNodeClick}
						onNodeRightClick={handleNodeRightClick}
						nodeCanvasObject={(node, ctx, globalScale) => {
							const ngNode = node as NetworkGraphNode
							const label = ngNode.name
							const fontSize = 12 / globalScale
							const isInModel = inModelColumnNames.includes(ngNode.id)
							ctx.font = `${
								isInModel ? 'bold' : 'normal'
							} ${fontSize}px Sans-Serif`
							const textWidth = ctx.measureText(label).width
							const bckgDimensions = [textWidth, fontSize].map(
								n => (n + fontSize) * 1.2,
							) // some padding
							ctx.fillStyle = 'rgba(255, 255, 255, 0.0)'
							const x = node?.x ?? 0
							const y = node?.y ?? 0

							ctx.fillRect(
								x - bckgDimensions[0] / 2,
								y - bckgDimensions[1] / 2,
								bckgDimensions[0],
								bckgDimensions[1],
							)

							ctx.textAlign = 'center'
							ctx.textBaseline = 'middle'
							ctx.fillStyle = '#000'
							ctx.fillText(label, ngNode.x ?? 0, ngNode.y ?? 0)
							// Taken from https://github.com/vasturiano/react-force-graph/blob/e67177b3522e2ffd212f807cbb6b74ed04a39ab6/example/text-nodes/index-2d.html#L36
							//eslint-disable-next-line
							;(ngNode as any).__bckgDimensions = bckgDimensions // to re-use in nodePointerAreaPaint
						}}
						nodePointerAreaPaint={(node, color, ctx) => {
							ctx.fillStyle = color
							// Taken from https://github.com/vasturiano/react-force-graph/blob/e67177b3522e2ffd212f807cbb6b74ed04a39ab6/example/text-nodes/index-2d.html#L40
							//eslint-disable-next-line
							const bckgDimensions: number[] = (node as any).__bckgDimensions
							const x = node?.x ?? 0
							const y = node?.y ?? 0
							ctx.fillRect(
								x - bckgDimensions[0] / 2,
								y - bckgDimensions[1] / 2,
								bckgDimensions[0],
								bckgDimensions[1],
							)
						}}
						cooldownTime={5000}
						onEngineStop={stopForces}
					/>
				)}
			</div>
		)
	},
)
