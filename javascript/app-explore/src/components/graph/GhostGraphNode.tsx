/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilValue } from 'recoil'

import { SelectedObjectState } from '../../state/index.js'
import { CausalNode } from './../graph/CausalNode.js'
import type { CausalNodeProps } from './CausalNode.types.js'
import { NodeContainer } from './GhostGraphNode.styles.js'

export const GhostGraphNode: React.FC<CausalNodeProps> = memo(
	function GhostGraphNode(props) {
		const selectedObject = useRecoilValue(SelectedObjectState)
		const { variable } = props
		const isFocused = variable === selectedObject

		return (
			<NodeContainer
				style={{
					border: isFocused ? '1px solid grey' : undefined,
					maxWidth: '120px',
				}}
			>
				<Stack horizontal tokens={{ childrenGap: 5 }}>
					<CausalNode {...props} center></CausalNode>
				</Stack>
			</NodeContainer>
		)
	},
)
