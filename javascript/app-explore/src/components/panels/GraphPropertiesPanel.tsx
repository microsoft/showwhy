/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useRecoilValue } from 'recoil'

import { CausalGraphChangesState } from '../../state/CausalGraphState.js'
import { AlgorithmControls } from '../AlgorithmControls.js'
import { Divider } from '../controls/Divider.js'
import { GraphDifferenceList } from '../GraphChanges.js'
import { ConstraintsPanel } from './ConstraintsPanel.js'

export const GraphPropertiesPanel: React.FC = memo(
	function GraphPropertiesPanel() {
		const changes = useRecoilValue(CausalGraphChangesState)
		return (
			<>
				<AlgorithmControls />
				<ConstraintsPanel>
					<Divider>Constraints</Divider>
				</ConstraintsPanel>
				{changes && (
					<>
						<Divider>Changes</Divider>
						<GraphDifferenceList differences={changes}></GraphDifferenceList>
					</>
				)}
			</>
		)
	},
)
