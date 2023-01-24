/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AppServices } from '@datashaper/app-framework'
import { Pivot, PivotItem } from '@fluentui/react'
import React, { memo, useMemo, useRef } from 'react'

import { CausalQuestion } from '../components/CausalQuestion.js'
import { EstimateEffects } from '../pages/EstimateEffects/index.js'
import { PrepareAnalysis } from '../pages/PrepareAnalysis/index.js'
import { ValidateEffects } from '../pages/ValidateEffects/index.js'
import { useSelectedTabKeyValueState } from '../state/index.js'
import { CONFIGURATION_TABS } from '../types.js'
import { useInit, useOnHandleTabClicked } from './App.hooks.js'
import { Container, usePivotStyles } from './App.styles.js'

export const App: React.FC<{ api: AppServices }> = memo(function App({ api }) {
	const pivotStyles = usePivotStyles()
	const selectedTabKey = useSelectedTabKeyValueState()
	const onHandleTabClicked = useOnHandleTabClicked()
	const ref = useRef<HTMLDivElement>(null)
	useInit()

	const width = useMemo((): string => {
		return ref?.current?.offsetWidth ? `${ref.current.offsetWidth}px` : `100%}`
	}, [ref])

	return (
		<Container>
			<Pivot
				ref={ref}
				aria-label="SynthDiD Navigation Tabs"
				onLinkClick={onHandleTabClicked}
				selectedKey={selectedTabKey}
				styles={pivotStyles}
			>
				<PivotItem
					headerText={CONFIGURATION_TABS.prepareAnalysis.label}
					itemKey={CONFIGURATION_TABS.prepareAnalysis.key}
				>
					<PrepareAnalysis api={api} />
				</PivotItem>
				<PivotItem
					headerText={CONFIGURATION_TABS.estimateEffects.label}
					itemKey={CONFIGURATION_TABS.estimateEffects.key}
				>
					<EstimateEffects api={api} />
				</PivotItem>
				<PivotItem
					headerText={CONFIGURATION_TABS.validateEffects.label}
					itemKey={CONFIGURATION_TABS.validateEffects.key}
				>
					<ValidateEffects api={api} />
				</PivotItem>
			</Pivot>
			<CausalQuestion width={width} />
		</Container>
	)
})
