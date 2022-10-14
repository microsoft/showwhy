/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack } from '@fluentui/react'
import {
	ClearIcon,
	FavoriteStarFillIcon,
	RevToggleKeyIcon,
} from '@fluentui/react-icons-mdl2'
import { memo } from 'react'
import type { anchorType } from 'react-xarrows'
import Xarrow from 'react-xarrows'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import {
	FilteredCorrelationsState,
	SelectedObjectState,
	StraightEdgesState,
} from '../../state/index.js'
import { correlationForColumnNames } from '../../utils/Correlation.js'
import { map } from '../../utils/Math.js'
import { useEdgeColors, useSvgStyle } from './CausalEdge.hooks.js'
import type { CausalEdgeProps } from './CausalEdge.types.js'

export const CausalEdge: React.FC<CausalEdgeProps> = memo(function CausalEdge({
	relationship,
	minEdgeWidth,
	maxEdgeWidth,
	state = 'normal',
}) {
	const [selectedObject, setSelectedObject] =
		useRecoilState(SelectedObjectState)
	const correlations =
		useRecoilValueLoadable(FilteredCorrelationsState).valueMaybe() || []
	const useStraightEdges = useRecoilValue(StraightEdgesState)
	const strokeWidth = map(
		Math.abs(relationship.weight || 0),
		0,
		1,
		minEdgeWidth,
		maxEdgeWidth,
	)

	const { edgeColor, correlationEdgeColor } = useEdgeColors(
		relationship,
		state,
		selectedObject,
	)

	const svgStyle = useSvgStyle(state)
	const correlationRelationship = correlationForColumnNames(
		correlations,
		relationship.source.columnName,
		relationship.target.columnName,
	)
	const correlation = Math.abs(correlationRelationship?.weight ?? 0)
	const correlationStrokeWidth = map(
		correlation,
		0,
		1,
		minEdgeWidth,
		maxEdgeWidth,
	)

	const label =
		state === 'removed' ? (
			<ClearIcon style={iconStyle} />
		) : (
			<Stack horizontal tokens={{ childrenGap: 2 }}>
				<Stack.Item align="center">
					{state === 'added' && <FavoriteStarFillIcon style={iconStyle} />}
					{state === 'reversed' && <RevToggleKeyIcon style={iconStyle} />}
				</Stack.Item>
				<Stack.Item align="center">
					{relationship.weight !== undefined && (
						<div style={{ fontSize: '8pt', fontWeight: 'bold' }}>
							{relationship.weight.toFixed(2)}
						</div>
					)}
					{relationship.confidence !== undefined && (
						<div style={{ fontSize: '8pt', fontWeight: 'bold' }}>
							conf={relationship.confidence.toFixed(2)}
						</div>
					)}
					{correlationRelationship && (
						<div style={{ fontSize: '8pt' }}>corr={correlation.toFixed(2)}</div>
					)}
				</Stack.Item>
			</Stack>
		)

	const startAnchor: anchorType = {
		position: useStraightEdges ? 'auto' : 'right',
		offset: { x: 0, y: 0 },
	}
	const endAnchor: anchorType = {
		position: useStraightEdges ? 'auto' : 'left',
		offset: { x: 0, y: 0 },
	}
	const path = useStraightEdges ? 'straight' : 'smooth'
	const headSize = (maxEdgeWidth * 2) / strokeWidth
	const correlationHeadSize = (maxEdgeWidth * 2) / correlationStrokeWidth
	const showArrowHead = true

	const confidence = relationship.confidence ?? 1
	const unconfidence = 1 - confidence
	const dashStrokLen = 5 + confidence * 50
	const dashNonStrokLen = 3 + unconfidence * 2
	const dashness = {
		strokeLen: dashStrokLen,
		nonStrokeLen: dashNonStrokLen,
		animation: 0.6,
	}

	return (
		<div key={relationship.key}>
			<Xarrow
				start={relationship.source.columnName}
				end={relationship.target.columnName}
				startAnchor={startAnchor}
				endAnchor={endAnchor}
				color={edgeColor}
				strokeWidth={strokeWidth}
				path={path}
				headSize={headSize}
				// tailSize={tailSize}
				// showTail={true}
				showHead={showArrowHead}
				showTail={false}
				// tailShape={'circle'}
				labels={label}
				passProps={{ onClick: () => setSelectedObject(relationship) }}
				dashness={dashness}
				SVGcanvasStyle={svgStyle}
				// SVGcanvasStyle={{filter: 'blur(5px)'}}
			/>
			{correlationRelationship && state !== 'removed' && (
				<Xarrow
					start={relationship.source.columnName}
					end={relationship.target.columnName}
					startAnchor={startAnchor}
					endAnchor={endAnchor}
					color={correlationEdgeColor}
					strokeWidth={correlationStrokeWidth}
					headSize={correlationHeadSize}
					showHead={showArrowHead}
					showTail={false}
					path={path}
					key={relationship.key + '-correlation'}
					dashness={{ strokeLen: 20, nonStrokeLen: 30, animation: 0 }}
					// SVGcanvasStyle={{filter: 'blur(2px)'}}
				/>
			)}
		</div>
	)
})

const iconStyle = { fontSize: '8pt' }
