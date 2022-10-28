/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageBarType, Pivot, PivotItem } from '@fluentui/react'
import { memo, useMemo, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useXarrow, Xwrapper } from 'react-xarrows'

import { AppMenu } from '../components/AppMenu.js'
import { CausalQuestion } from '../components/CausalQuestion.js'
import { MessageContainer } from '../components/MessageContainer.js'
import { Header } from '../components/styles.js'
import { useCausalQuestion } from '../state/causalQuestion.js'
import type { Maybe } from '../types/primitives.js'
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
			navigate(`${route}/${item.props.itemKey as string}`)
		}
	}

	const key = useMemo(() => {
		return location.pathname.replace(`${route}/`, '') || 'define'
	}, [location, route])

	return (
		<Container>
			<Header>
				<Pivot
					aria-label="Model Exposure Flow"
					selectedKey={key}
					onLinkClick={handleLinkClick}
				>
					<PivotItem headerText="1. Define question" itemKey="define" />
					<PivotItem headerText="2. Build model" itemKey="build" />
					<PivotItem headerText="3. Bind data" itemKey="bind" />
					<PivotItem headerText="4. Estimate effects" itemKey="analyze" />
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
