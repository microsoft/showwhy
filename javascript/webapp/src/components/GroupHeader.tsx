/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsGroupDividerProps, IGroup } from '@fluentui/react'
import { memo, useCallback, useEffect, useRef } from 'react'

import { useIntersection } from './GroupHeader.hooks.js'
import {
	GridIcon,
	HeaderContainer,
	HeaderDetailsText,
	LevelButton,
} from './GroupHeader.styles.js'

export const GroupHeader: React.FC<
	React.PropsWithChildren<{ props: IDetailsGroupDividerProps }>
> = memo(function GroupHeader({ props, children }) {
	const { group, onToggleCollapse } = props
	const ref = useRef<HTMLDivElement>()
	// trigger as soon as the element becomes visible
	const inViewport = useIntersection(ref.current, '0px')

	useEffect(() => {
		if (inViewport && group?.isCollapsed) {
			onToggleCollapse?.(group)
		}
	}, [inViewport, group, onToggleCollapse])

	const onManualLevelToggle = useCallback(() => {
		onToggleCollapse?.(group as IGroup)
	}, [group, onToggleCollapse])

	return (
		<HeaderContainer
			// uses the ref to toggle if element is into view if the user didn't toggled it with the button
			ref={() => (ref.current = undefined)}
			groupLevel={group?.level as number}
		>
			<LevelButton
				onClick={onManualLevelToggle}
				iconProps={{
					iconName: group?.isCollapsed ? 'ChevronRight' : 'ChevronDown',
				}}
			></LevelButton>
			{!!children && <>{children}</>}
			{!children && (
				<HeaderDetailsText>
					<GridIcon iconName={icons.grid}></GridIcon>
					{group?.name}
				</HeaderDetailsText>
			)}
		</HeaderContainer>
	)
})

const icons = {
	grid: 'GridViewSmall',
}
