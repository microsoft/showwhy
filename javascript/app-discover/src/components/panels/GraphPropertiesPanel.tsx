/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { AlgorithmControls } from '../AlgorithmControls.js'
import { ConstraintsPanel } from './ConstraintsPanel.js'

export const GraphPropertiesPanel: React.FC = memo(
	function GraphPropertiesPanel() {
		return (
			<>
				<AlgorithmControls />
				<ConstraintsPanel></ConstraintsPanel>
			</>
		)
	},
)
