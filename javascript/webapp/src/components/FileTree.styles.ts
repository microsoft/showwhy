/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IStyle } from '@fluentui/react'
import {
	CommandBar,
	CommandBarButton,
	Icon,
	IconButton,
	useTheme,
} from '@fluentui/react'
import {
	fluentTreeItem,
	fluentTreeView,
	provideFluentDesignSystem,
} from '@fluentui/web-components'
import { provideReactWrapper } from '@microsoft/fast-react-wrapper'
import React, { useMemo } from 'react'
import styled from 'styled-components'

const { wrap } = provideReactWrapper(React, provideFluentDesignSystem())
const FluentTreeItem = wrap(fluentTreeItem())
export const TreeView = wrap(fluentTreeView())

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
`

export const MenuContainer = styled.div`
	width: 100%;
`

export const CollapsedButton = styled(CommandBarButton)`
	width: inherit;
	height: calc(
		(var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
	);
`

export const ItemIcon = styled(Icon)``

export const TreeItem = styled(FluentTreeItem)`
	align-items: center;
`

export const Commands = styled(CommandBar)`
	.ms-CommandBar {
		padding-left: unset;
	}
`

export const ExpandButton = styled(IconButton)`
	width: inherit;
`

export const collapsedButtonStyles = {
	menuIcon: { display: 'none' },
	flexContainer: { marginRight: '10px' },
}

export const tooltipStyles = {
	root: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		width: '100%',
	} as IStyle,
}

export const icons = {
	openFile: { iconName: 'FabricOpenFolderHorizontal' },
	save: { iconName: 'Save' },
	table: { iconName: 'Table' },
	grid: { iconName: 'GridViewSmall' },
	file: { iconName: 'Page' },
	project: { iconName: 'ZipFolder' },
	openExpandedView: { iconName: 'DoubleChevronRight12' },
	closeExpandedView: { iconName: 'DoubleChevronLeft12' },
}

export function useCommandbarStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				background: theme.palette.neutralLighter,
				borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
			},
		}),
		[theme],
	)
}
