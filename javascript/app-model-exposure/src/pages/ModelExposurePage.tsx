/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageBarType, Pivot, PivotItem } from '@fluentui/react'
import { memo, useEffect, useMemo, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useXarrow, Xwrapper } from 'react-xarrows'

import { AppMenu } from '../components/AppMenu.js'
import { CausalQuestion } from '../components/CausalQuestion.js'
import { MessageContainer } from '../components/MessageContainer.js'
import { Header } from '../components/styles.js'
import { useCausalQuestion } from '../state/causalQuestion.js'
import { usePageTab } from '../state/pageTabState.js'
import type { Maybe } from '../types/primitives.js'
import { PageTabs } from '../types/workspace/PageTabs.js'
import { AnalyzeTestPage } from './AnalyzeTestPage.js'
import { BindDataPage } from './BindDataPage.js'
import { BuildDomainModelPage } from './BuildDomainModelPage.js'
import { DefineDomainModelPage } from './DefineDomainModelPage.js'
import { Container, Content } from './ModelExposurePage.styles.js'

const EXTERNAL_ROUTE = 'exposure'
const EXTERNAL_ROUTE_KUBERNETES = `_${EXTERNAL_ROUTE}`
export const ModelExposurePage: React.FC = memo(function ModelExposurePage() {
	const location = useLocation()
	const question = useCausalQuestion()
	const navigate = useNavigate()
	const updateXarrow = useXarrow()
	const [pageTab, setPageTab] = usePageTab()
	const [error, setError] = useState<Maybe<string>>()

	const route = useMemo(() => {
		return location.pathname.includes(`${EXTERNAL_ROUTE_KUBERNETES}`)
			? `/${EXTERNAL_ROUTE_KUBERNETES}`
			: location.pathname.includes('exposure')
			? `/${EXTERNAL_ROUTE}`
			: ''
	}, [location])

	const handleLinkClick = (item?: PivotItem) => {
		if (item) {
			setPageTab(item.props.itemKey)
			navigate(`${route}/${item.props.itemKey as string}`)
		}
	}

	useEffect(() => {
		navigate(`${route}/${pageTab}`)
		/* eslint-disable-next-line */
	}, [])

	return (
		<Container>
			<Header>
				<Pivot
					aria-label="Model Exposure Flow"
					selectedKey={pageTab}
					onLinkClick={handleLinkClick}
				>
					<PivotItem
						headerText="1. Define question"
						itemKey={PageTabs.DefineQuestion}
					/>
					<PivotItem
						headerText="2. Build model"
						itemKey={PageTabs.BuildModel}
					/>
					<PivotItem headerText="3. Bind data" itemKey={PageTabs.BindData} />
					<PivotItem
						headerText="4. Estimate effects"
						itemKey={PageTabs.EstimateEffects}
					/>
				</Pivot>
				<CausalQuestion question={question} />
				<AppMenu setError={setError} />
			</Header>
			<Xwrapper>
				<Content onScroll={updateXarrow}>
					{error ? (
						<MessageContainer
							onDismiss={() => setError(undefined)}
							type={MessageBarType.error}
							styles={{ margin: '1rem 0' }}
						>
							{error}
						</MessageContainer>
					) : null}
					<Routes>
						<Route path="/" element={<DefineDomainModelPage />} />
						<Route path="define" element={<DefineDomainModelPage />} />
						<Route path="build" element={<BuildDomainModelPage />} />
						<Route path="bind" element={<BindDataPage />} />
						<Route path="analyze" element={<AnalyzeTestPage />} />
					</Routes>
				</Content>
			</Xwrapper>
		</Container>
	)
})
