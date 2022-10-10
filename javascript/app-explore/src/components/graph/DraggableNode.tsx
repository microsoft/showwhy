/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// TODO: re-enable, this check is important
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
	Children,
	cloneElement,
	isValidElement,
	memo,
	useEffect,
	useRef,
	useState,
} from 'react'
import Draggable from 'react-draggable'
import { useXarrow } from 'react-xarrows'
import { useRecoilState } from 'recoil'

import { nodePositionsFamily } from '../../state/GraphLayoutState.jsx'
import type { DraggableGraphNodeProps } from './DraggableNode.types.js'

export const DraggableGraphNode: React.FC<DraggableGraphNodeProps> = memo(
	function DraggableNodeGraph({
		id,
		children,
		layout,
		layoutTransitionTime = 0,
	}) {
		const nodeRef = useRef(null)
		const updateXarrow = useXarrow()
		const [position, setPosition] = useRecoilState(nodePositionsFamily(id))

		const layoutNode = layout?.children?.find(node => node.id === id)
		const layoutPosition = {
			x: layoutNode?.x ?? position.x,
			y: layoutNode?.y ?? position.y,
		}

		useEffect(() => {
			setPosition(layoutPosition)
		}, [layout])

		const [isControlled, setIsControlled] = useState(true)
		const [wasDragged, setWasDragged] = useState(false)
		// TODO: this is to make sure that the arrows are in the right position when
		// the layout animation ends.  Pretty sure this isn't a great approach...
		useEffect(() => {
			setTimeout(updateXarrow, layoutTransitionTime)
		}, [position, layoutTransitionTime, updateXarrow])

		const childrenWithProps = Children.map(children, child => {
			if (!isValidElement(child)) return child
			/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
			return cloneElement(child, { wasDragged } as any)
		})
		return (
			<div style={{ position: 'absolute', width: 0, height: 0 }}>
				<Draggable
					handle=".handle"
					cancel=".no-drag"
					onDrag={() => {
						setWasDragged(true)
						updateXarrow()
					}}
					onStart={() => {
						setWasDragged(false)
						setIsControlled(false)
					}}
					onStop={(evt, dragObj) => {
						setIsControlled(true)
						setPosition({
							x: dragObj.x,
							y: dragObj.y,
							right: dragObj.x + dragObj.node.offsetWidth,
							bottom: dragObj.y + dragObj.node.offsetHeight,
						})
					}}
					bounds={{ left: 0, top: 0 }}
					nodeRef={nodeRef}
					position={position}
				>
					<div
						id={id}
						ref={nodeRef}
						style={{
							display: 'inline-block',
							transition: isControlled
								? `transform ${layoutTransitionTime}ms`
								: 'none',
						}}
					>
						{childrenWithProps}
					</div>
				</Draggable>
			</div>
		)
	},
)
