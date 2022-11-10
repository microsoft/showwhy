/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FileTree, type ResourceTreeData } from '@datashaper/app-framework'
import { useBoolean } from '@fluentui/react-hooks'
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import { Allotment } from 'allotment'
import { memo, useCallback, useRef } from 'react'

import { Header } from './Header.js'
import { Container, Content, Main, useFileTreeStyle } from './Layout.styles.js'
import type { LayoutProps } from './Layout.types.js'
import { pages } from '../pages.js'
import { useExampleProjects } from '../hooks/examples.js'

export const Layout: React.FC<LayoutProps> = memo(function Layout({
	children,
}) {
	const fileTreeStyle = useFileTreeStyle()
	const ref = useRef<AllotmentHandle | null>(null)
	const [expanded, { toggle: toggleExpanded }] = useBoolean(true)

	const onToggle = useCallback(() => {
		if (expanded) {
			ref?.current?.resize([60])
		} else {
			ref?.current?.reset()
		}
		toggleExpanded()
	}, [expanded, toggleExpanded])

	const changeWidth = useCallback(
		(sizes: number[]) => {
			const [menuSize] = sizes
			if ((menuSize < 150 && expanded) || (menuSize > 150 && !expanded)) {
				toggleExpanded()
			}
		},
		[expanded, toggleExpanded],
	)

	const { run: onChangeWidth } = useDebounceFn(
		(sizes: number[]) => {
			changeWidth(sizes)
		},
		{ wait: 200 },
	)
	const examples = useExampleProjects()

	return (
		<Container id="layout">
			<Header />
			<Main>
				<Content>
					<Allotment
						onChange={onChangeWidth}
						proportionalLayout={false}
						ref={ref}
						separator={false}
					>
						<Allotment.Pane preferredSize={300} maxSize={300} minSize={60}>
							<FileTree
								expanded={expanded}
								toggleExpanded={onToggle}
								style={fileTreeStyle}
								appResources={appResources}
								examples={examples}
							/>
						</Allotment.Pane>
						<Allotment.Pane>{children}</Allotment.Pane>
					</Allotment>
				</Content>
			</Main>
		</Container>
	)
})

const appResources: ResourceTreeData[] = [
	{
		title: 'Causal Discovery',
		icon: pages.discover.icon,
		route: `/${pages.discover.route}`,
	},
	{
		title: 'Exposure Analysis',
		icon: pages.exposure.icon,
		route: `/${pages.exposure.route}`,
	},
	{
		title: 'Event Analysis',
		icon: pages.events.icon,
		route: `/${pages.events.route}`,
	},
]
