/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilState } from 'recoil'

import { CausalDiscoveryNormalizationState } from '../state/index.js'
import { NormalizationControlsContainer } from './NormalizationControls.styles.js'

export const NormalizationControls = memo(function NormalizationControls() {
	const [causalDiscoveryNormalization, setCausalDiscoveryNormalization] =
		useRecoilState(CausalDiscoveryNormalizationState)

	return (
		<NormalizationControlsContainer>
			<Checkbox
				label="Normalize with mean"
				checked={causalDiscoveryNormalization.normalizeWithMeanEnabled}
				onChange={(_, v) =>
					setCausalDiscoveryNormalization(prev => ({
						...prev,
						normalizeWithMeanEnabled: Boolean(v),
					}))
				}
			/>
			<Checkbox
				label="Normalize with standard deviation"
				checked={causalDiscoveryNormalization.normalizeWithStdEnabled}
				onChange={(_, v) =>
					setCausalDiscoveryNormalization(prev => ({
						...prev,
						normalizeWithStdEnabled: Boolean(v),
					}))
				}
			/>
		</NormalizationControlsContainer>
	)
})
