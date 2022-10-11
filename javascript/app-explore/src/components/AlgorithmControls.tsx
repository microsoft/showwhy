/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'
import { ChoiceGroup } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import {
	useCausalDiscoveryAlgorithm,
	useSetCausalDiscoveryAlgorithm,
} from '../state/UIState.js'
import { ALGORITHMS } from './AlgorithmControls.constants.js'
import { Divider } from './controls/Divider.js'

export const AlgorithmControls = memo(function AlgorithmControls() {
	const selected = useCausalDiscoveryAlgorithm()
	const setSelected = useSetCausalDiscoveryAlgorithm()
	
	const select = useCallback(
		(_e: unknown, selection: IChoiceGroupOption | undefined) => {
			if (typeof selection?.value === 'string') {
				setSelected(
					CausalDiscoveryAlgorithm[
						selection.value as keyof typeof CausalDiscoveryAlgorithm
					],
				)
			}
		},
		[setSelected],
	)

	return (
		<>
			<Divider>Causal Discovery</Divider>
			<ChoiceGroup
				selectedKey={selected}
				options={ALGORITHMS}
				onChange={select}
			/>
		</>
	)
})
