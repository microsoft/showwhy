/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack } from '@fluentui/react'
import { useRecoilValue } from 'recoil'

import { SelectedObjectState } from '../../state/index.jsx'
import { CausalNode } from './CausalNode.jsx'
import type { CausalNodeProps } from './CausalNode.types.js'
import { NodeContainer } from './CorrelationGraphNode.styles.js'

export const CorrelationGraphNode = function (props: CausalNodeProps) {
	const selectedObject = useRecoilValue(SelectedObjectState)
	const { variable } = props
	const isFocused = variable === selectedObject

	return (
		<NodeContainer
			style={{
				border: isFocused ? '1px solid grey' : undefined,
				maxWidth: '100px',
			}}
		>
			<Stack horizontal tokens={{ childrenGap: 5 }}>
				<CausalNode {...props} center></CausalNode>
			</Stack>
		</NodeContainer>
	)
}
