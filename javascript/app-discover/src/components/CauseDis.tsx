/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'allotment/dist/style.css'

import { MessageBar, MessageBarType } from '@fluentui/react'
import { CommonLayout } from '@showwhy/app-common'
import { Allotment } from 'allotment'
import { memo, Suspense } from 'react'
import { useMeasure } from 'react-use'
import { useRecoilValue } from 'recoil'

import { ErrorMessageState, LoadingState } from '../state/index.js'
import {
	FillContainer,
	FullScreenContainer,
	HalfHeightContainer,
	PaddedSpinner,
	ScrollableFullScreenContainer,
} from './CauseDis.styles.js'
import { Divider } from './controls/Divider.js'
import { GraphViews } from './graph/GraphViews.js'
import { AllCausalVariablesList } from './lists/CausalVariableList.js'
import { AllCorrelationsList } from './lists/CorrelationList.js'
import { MenuBar } from './MenuBar.js'
import { PropertyPanels } from './panels/PropertyPanels.js'

export const CauseDis = memo(function CauseDis() {
	const loading = useRecoilValue(LoadingState)
	const errorMessage = useRecoilValue(ErrorMessageState)
	const [ref, { width, height }] = useMeasure<HTMLDivElement>()

	return (
		<CommonLayout
			configRail={<AppLeftRail />}
			detailRail={<AppRightRail />}
			menu={
				<Suspense fallback={<PaddedSpinner label="Loading menubar..." />}>
					<MenuBar />
				</Suspense>
			}
		>
			{errorMessage && (
				<MessageBar messageBarType={MessageBarType.error}>
					{errorMessage}
				</MessageBar>
			)}
			{loading ? (
				<PaddedSpinner label={loading} />
			) : (
				<FillContainer ref={ref}>
					<GraphViews dimensions={{ width, height }} />
				</FillContainer>
			)}
		</CommonLayout>
	)
})

const AppLeftRail: React.FC = memo(function AppLeftRail() {
	return (
		<FullScreenContainer>
			<Allotment vertical>
				<HalfHeightContainer>
					<Divider>Variables</Divider>
					<AllCausalVariablesList />
				</HalfHeightContainer>
				<HalfHeightContainer>
					<Divider>Correlations</Divider>
					<AllCorrelationsList />
				</HalfHeightContainer>
			</Allotment>
		</FullScreenContainer>
	)
})

const AppRightRail: React.FC = memo(function AppRightRail() {
	return (
		<Suspense fallback={<PaddedSpinner label="Loading properties..." />}>
			<ScrollableFullScreenContainer>
				<PropertyPanels />
			</ScrollableFullScreenContainer>
		</Suspense>
	)
})
