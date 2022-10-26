/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'
import { ChoiceGroup } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import { SelectedCausalDiscoveryAlgorithmState } from '../state/index.js'
import { ALGORITHMS } from './AlgorithmControls.constants.js'
import { AlgorithmsContainer } from './AlgorithmControls.styles.js'
import { Divider } from './controls/Divider.js'
import { DeciParams } from './DeciParams.js'
import { GraphFilteringControls } from './GraphFilteringControls.js'

export const AlgorithmControls = memo(function AlgorithmControls() {
	const [
		selectedCausalDiscoveryAlgorithm,
		setSelectedCausalDiscoveryAlgorithm,
	] = useRecoilState(SelectedCausalDiscoveryAlgorithmState)
	const selectAlgorithm = useCallback(
		(_e: unknown, selection: IChoiceGroupOption | undefined) => {
			if (typeof selection?.value === 'string') {
				setSelectedCausalDiscoveryAlgorithm(
					CausalDiscoveryAlgorithm[
						selection.value as keyof typeof CausalDiscoveryAlgorithm
					],
				)
			}
		},
		[setSelectedCausalDiscoveryAlgorithm],
	)

	return (
		<AlgorithmsContainer>
			<Divider>Discovery algorithm</Divider>
			<ChoiceGroup
				selectedKey={selectedCausalDiscoveryAlgorithm}
				options={ALGORITHMS}
				onChange={selectAlgorithm}
			/>

			<Divider>Graph filtering</Divider>
			<GraphFilteringControls />

			{selectedCausalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.DECI && (
				<>
					<Divider>Selected algorithm options</Divider>
					<DeciParams />
				</>
			)}
		</AlgorithmsContainer>
	)
})
