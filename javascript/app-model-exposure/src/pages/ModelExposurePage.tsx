/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageBarType, Pivot, PivotItem } from '@fluentui/react'
import { memo, useEffect, useRef, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
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
import type { ModelExposurePageProps } from './ModelExposurePage.types.js'

export const ModelExposurePage: React.FC<ModelExposurePageProps> = memo(
	function ModelExposurePage({ href, api }) {
		const scrollRef = useRef<HTMLElement>(null)
		const question = useCausalQuestion()
		const navigate = useNavigate()
		const updateXarrow = useXarrow()
		const [pageTab, setPageTab] = usePageTab()
		const [error, setError] = useState<Maybe<string>>()

		const handleLinkClick = (item?: PivotItem) => {
			if (item) {
				setPageTab(item.props.itemKey as PageTabs)
				scrollRef.current?.scroll(0, 0)
				navigate(`${href}/${item.props.itemKey as string}`)
			}
		}

		useEffect(() => {
			navigate(`${href}/${pageTab}`)
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
					<Content ref={scrollRef} onScroll={updateXarrow}>
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
							<Route element={<DefineDomainModelPage api={api} />} index />
							<Route
								path="define"
								element={<DefineDomainModelPage api={api} />}
							/>
							<Route
								path="build"
								element={<BuildDomainModelPage api={api} />}
							/>
							<Route path="bind" element={<BindDataPage api={api} />} />
							<Route path="analyze" element={<AnalyzeTestPage api={api} />} />
						</Routes>
					</Content>
				</Xwrapper>
			</Container>
		)
	},
)
