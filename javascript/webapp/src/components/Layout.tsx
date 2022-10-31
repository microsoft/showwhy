/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import { Allotment } from 'allotment'
import { memo, useCallback, useRef } from 'react'

import { FileTree } from './FileTree.js'
import { Header } from './Header.js'
import { Container, Content, Main, useFileTreeStyle } from './Layout.styles.js'
import type { LayoutProps } from './Layout.types.js'

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

	const { run: abc } = useDebounceFn(
		(sizes: number[]) => {
			onChangeWidth(sizes)
		},
		{ wait: 200 },
	)

	const onChangeWidth = useCallback(
		(sizes: number[]) => {
			console.log(sizes)
			const [menuSize] = sizes
			if ((menuSize < 150 && expanded) || (menuSize > 150 && !expanded)) {
				toggleExpanded()
			}
		},
		[expanded, toggleExpanded],
	)

	return (
		<Container id="layout">
			<Header />
			<Main>
				<Content>
					<Allotment onChange={abc} proportionalLayout={false} ref={ref}>
						<Allotment.Pane preferredSize={300} maxSize={300} minSize={60}>
							<FileTree
								expanded={expanded}
								toggleExpanded={onToggle}
								style={fileTreeStyle}
							/>
						</Allotment.Pane>
						<Allotment.Pane>{children}</Allotment.Pane>
					</Allotment>
				</Content>
			</Main>
		</Container>
	)
})
