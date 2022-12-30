/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot, PivotItem } from '@fluentui/react'
import React, { memo } from 'react'

import { EstimateEffects } from '../pages/EstimateEffects/index.js'
import { PrepareAnalysis } from '../pages/PrepareAnalysis/index.js'
import { ValidateEffects } from '../pages/ValidateEffects/index.js'
import { useSelectedTabKeyValueState } from '../state/index.js'
import { CONFIGURATION_TABS } from '../types.js'
import { useInit, useOnHandleTabClicked, usePivotStyles } from './App.hooks.js'
import { Container } from './App.styles.js'

export const App: React.FC = memo(function App() {
	const pivotStyles = usePivotStyles()
	const selectedTabKey = useSelectedTabKeyValueState()
	const onHandleTabClicked = useOnHandleTabClicked()
	useInit()

	return (
		<Container>
			<Pivot
				aria-label="SynthDiD Navigation Tabs"
				className="tabControl"
				onLinkClick={onHandleTabClicked}
				selectedKey={selectedTabKey}
				styles={pivotStyles}
			>
				<PivotItem
					headerText={CONFIGURATION_TABS.prepareAnalysis.label}
					itemKey={CONFIGURATION_TABS.prepareAnalysis.key}
				>
					<PrepareAnalysis />
				</PivotItem>
				<PivotItem
					headerText={CONFIGURATION_TABS.estimateEffects.label}
					itemKey={CONFIGURATION_TABS.estimateEffects.key}
				>
					<EstimateEffects />
				</PivotItem>
				<PivotItem
					headerText={CONFIGURATION_TABS.validateEffects.label}
					itemKey={CONFIGURATION_TABS.validateEffects.key}
				>
					<ValidateEffects />
				</PivotItem>
			</Pivot>
		</Container>
	)
})
