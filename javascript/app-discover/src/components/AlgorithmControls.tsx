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
import { Divider } from './controls/Divider.js'

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
		<>
			<Divider>Causal Discovery</Divider>
			<ChoiceGroup
				selectedKey={selectedCausalDiscoveryAlgorithm}
				options={ALGORITHMS}
				onChange={selectAlgorithm}
			/>
		</>
	)
})
