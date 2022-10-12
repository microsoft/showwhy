/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useRecoilValue } from 'recoil'

import {
	CausalInferenceSupportedState,
	SelectedObjectState,
} from '../../state/index.js'
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
					{isInferenceSupported && (
						<CausalInferenceSlider {...props}></CausalInferenceSlider>
					)}
				</NodeContainer>
			</>
		)
	},
)
