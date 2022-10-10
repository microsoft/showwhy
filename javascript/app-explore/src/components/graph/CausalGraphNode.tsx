/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useRecoilValue } from 'recoil'

import { CausalInferenceSupportedState } from '../../state/CausalInferenceState.js'
import { SelectedObjectState } from '../../state/UIState.js'
import { CausalInferenceSlider } from '../controls/CausalInferenceSlider.js'
import { NodeContainer } from './CausalGraphNode.styles.js'
import { CausalNode } from './CausalNode.js'
import type { CausalNodeProps } from './CausalNode.types.js'

export const CausalGraphNode: React.FC<CausalNodeProps> = memo(
	function CausalGraphNode(props) {
		const { variable } = props
		const selectedObject = useRecoilValue(SelectedObjectState)
		const isFocused = variable === selectedObject
		const isInferenceSupported = useRecoilValue(CausalInferenceSupportedState)
		// const weightThreshold = useRecoilValue(WeightThresholdState);
		// const causalGraph = useRecoilValue(CausalGraphState);
		// const isInModel = Graph.includesVariable(causalGraph, variable);
		// const hasChildren = isInModel && Graph.nodeHasChildren(causalGraph, variable, weightThreshold);
		// const hasParents = isInModel && Graph.nodeHasParents(causalGraph, variable, weightThreshold);

		return (
			<>
				<NodeContainer
					className="handle"
					style={{
						border: isFocused ? '1px solid grey' : undefined,
						width: '150px',
					}}
				>
					<CausalNode className="handle" {...props}></CausalNode>
					{/* <Stack horizontal horizontalAlign="space-between">
				{hasParents && <Stack.Item align="center"><ChevronRightIcon/></Stack.Item>}
				{hasChildren && <Stack.Item align="center"><ChevronRightIcon/></Stack.Item>}
			</Stack> */}
					{isInferenceSupported && (
						<CausalInferenceSlider {...props}></CausalInferenceSlider>
					)}
				</NodeContainer>
			</>
		)
	},
)
