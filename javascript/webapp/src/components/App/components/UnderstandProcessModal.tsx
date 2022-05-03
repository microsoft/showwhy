/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IIconProps } from '@fluentui/react'
import { mergeStyleSets, Modal, Pivot, PivotItem } from '@fluentui/react'
import { useId } from '@fluentui/react-hooks'
import { IconButton } from '@fluentui/react/lib/Button'
import type { Handler, WorkflowHelp } from '@showwhy/types'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useMarkdown } from '~hooks'
import { UnderstandProcessItem } from './UnderstandProcessItem'

export const UnderstandProcessModal: FC<{
	isModalOpen: boolean
	toggleModal: Handler
	items: WorkflowHelp[]
}> = memo(function UnderstandProcessModal({ isModalOpen, toggleModal, items }) {
	const titleId = useId('title')
	const [activeItem, setActiveItem] = useState(items[0])
	const markdown = useMarkdown(activeItem?.getMarkdown)

	const onChange = useCallback(
		(pivotItem?: PivotItem) => {
			const active = items.find(a => a.id === pivotItem?.props.id)
			setActiveItem(active)
		},
		[items, setActiveItem],
	)

	return (
		<UnderstandModal
			titleAriaId={titleId}
			isOpen={isModalOpen}
			onDismiss={toggleModal}
			containerClassName={contentStyles.container}
		>
			<Header>
				<Title data-pw="understand-question-title">Understand process</Title>
				<Icon
					iconProps={cancelIcon}
					ariaLabel="Close popup modal"
					onClick={toggleModal}
				/>
			</Header>
			<MainPivot
				defaultSelectedKey={items[0]?.id}
				onLinkClick={link => onChange(link)}
			>
				{items.map(item => (
					<PivotItem id={item.id} key={item.id} headerText={item.title}>
						<UnderstandProcessItem markdown={markdown} workflow={item} />
					</PivotItem>
				))}
			</MainPivot>
		</UnderstandModal>
	)
})

const MainPivot = styled(Pivot)`
	padding: 0px 10px;
`

const UnderstandModal = styled(Modal)`
	.ms-Dialog-main {
		width: 80%;
		min-height: 80%;
		display: flex;
		flex-flow: column nowrap;
		align-items: stretch;
	}
`

const cancelIcon: IIconProps = { iconName: 'Cancel' }

const contentStyles = mergeStyleSets({
	container: {
		display: 'flex',
		flexFlow: 'column nowrap',
		alignItems: 'stretch',
	},
})

const Icon = styled(IconButton)`
	&:hover {
		color: ${({ theme }) => theme.palette.neutralDark};
	}
`

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const Title = styled.h3`
	padding-left: 12px;
	margin: 8px 0 8px 0;
`
