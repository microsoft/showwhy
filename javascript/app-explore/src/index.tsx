/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, Suspense } from 'react'

import { CauseDis } from './components/CauseDis.js'
import { CauseDisErrorBoundary } from './components/CauseDisErrorBoundary.js'
import {
	useCausalDiscoveryRunner,
	useCausalGraphHistoryTracker,
} from './state/CausalGraphState.js'
import { useCausalInferenceUpdater } from './state/CausalInferenceState.js'
import { useRehydrateRecoil } from './state/hooks.js'

export const ExplorePage: React.FC = memo(function ExplorePage() {
	return (
		<CauseDisErrorBoundary>
			<Suspense fallback={null}>
				<CauseDisHooks />
			</Suspense>
			<CauseDis />
		</CauseDisErrorBoundary>
	)
})

const CauseDisHooks: React.FC = memo(function CauseDisHooks() {
	useRehydrateRecoil()
	useCausalGraphHistoryTracker()
	useCausalInferenceUpdater()
	useCausalDiscoveryRunner()
	return null
})

export default ExplorePage
