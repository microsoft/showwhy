/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ImportTable } from '@showwhy/app-common'
import type { BaseFile } from '@datashaper/utilities'
import { DirectionalHint, Separator } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import merge from 'lodash-es/merge.js'
import { memo, useCallback, useState } from 'react'

import type { ResourceTreeData } from '../models.js'
import { appLinks } from './FileTree.constants.js'
import {
	useCurrentPath,
	useFileManagementCommands,
	useOnOpenFileRequested,
	useOnOpenTable,
	useOnSelectItem,
	useTreeItems,
} from './FileTree.hooks.js'
import {
	buttonTooltipStyles,
	CollapsedButton,
	collapsedButtonStyles,
	Commands,
	Container,
	ExpandButton,
	icons,
	ItemIcon,
	MenuContainer,
	TreeItem,
	TreeView,
} from './FileTree.styles.js'
import { getTooltipStyles } from './FileTree.utils.js'
import { Tooltip } from './Tooltip.js'

export const FileTree: React.FC<{
	style?: React.CSSProperties
	className?: string
	selectedFileId?: string
}> = memo(function FileTree({ style, className }) {
	const [expanded, { toggle: toggleExpanded }] = useBoolean(true)
	const tooltipStyles = getTooltipStyles(expanded)
	const [file, setFile] = useState<BaseFile | undefined>()
	const onOpenFileRequested = useOnOpenFileRequested()
	const { commands, onOpenCommands, onSaveCommands } =
		useFileManagementCommands(expanded, onOpenFileRequested, setFile)

	return (
		<Container
			style={merge({ width: expanded ? '300px' : '60px' }, style)}
			className={className}
		>
			<MenuContainer>
				<FileImport file={file} setFile={setFile} />
				{expanded ? (
					<Commands items={commands} />
				) : (
					<>
						<Tooltip
							directionalHint={DirectionalHint.rightCenter}
							styles={tooltipStyles}
							content="Open"
						>
							<CollapsedButton
								styles={collapsedButtonStyles}
								iconProps={icons.openFile}
								menuProps={{
									items: onOpenCommands,
								}}
							/>
						</Tooltip>
						<Tooltip
							directionalHint={DirectionalHint.rightCenter}
							styles={tooltipStyles}
							content="Save"
						>
							<CollapsedButton
								styles={collapsedButtonStyles}
								iconProps={icons.save}
								menuProps={{
									items: onSaveCommands,
								}}
							/>
						</Tooltip>
					</>
				)}

				<TreeItems expanded={expanded} />
			</MenuContainer>
			<Tooltip
				directionalHint={DirectionalHint.rightCenter}
				styles={buttonTooltipStyles}
				content={expanded ? 'Show less information' : 'Show more information'}
			>
				<ExpandButton
					onClick={toggleExpanded}
					iconProps={
						expanded ? icons.closeExpandedView : icons.openExpandedView
					}
				/>
			</Tooltip>
		</Container>
	)
})

const FileImport: React.FC<{
	file: BaseFile | undefined
	setFile: (file: BaseFile | undefined) => void
}> = memo(function FileImport({ file, setFile }) {
	const onOpenTable = useOnOpenTable(file as BaseFile, setFile)
	const onCancelImport = useCallback(() => setFile(undefined), [setFile])

	return file == null ? null : (
		<ImportTable
			onCancel={onCancelImport}
			file={file}
			onOpenTable={onOpenTable}
		/>
	)
})

const TreeItems: React.FC<{ expanded: boolean }> = memo(function TreeItems({
	expanded,
}) {
	const items = useTreeItems()
	const currentPath = useCurrentPath()
	const onSelectItem = useOnSelectItem()
	return (
		<TreeView>
			{items.map((i: ResourceTreeData) => (
				<TreeNode
					expanded={expanded}
					key={i.route}
					node={i}
					selected={i.route === currentPath}
					onSelectItem={onSelectItem}
				/>
			))}
			{items.length > 0 ? <Separator /> : null}
			{appLinks.map((i: ResourceTreeData) => (
				<TreeNode
					expanded={expanded}
					key={i.route}
					node={i}
					selected={currentPath.includes(i.route)}
					onSelectItem={onSelectItem}
				/>
			))}
		</TreeView>
	)
})

const TreeNode: React.FC<{
	node: ResourceTreeData
	expanded: boolean
	selected?: boolean
	onSelectItem: (item: ResourceTreeData) => void
}> = memo(function TreeNode({ node, selected, onSelectItem, expanded }) {
	const tooltipStyles = getTooltipStyles(expanded)

	const children = node.children?.map(child => (
		<TreeNode
			expanded={expanded}
			key={child.route}
			node={child}
			onSelectItem={onSelectItem}
		/>
	))
	const handleOnClick = useCallback(
		(e: Event) => {
			e.stopPropagation()
			onSelectItem(node)
		},
		[onSelectItem, node],
	)
	return (
		<>
			<TreeItem
				key={node.route}
				title={expanded ? node.title : ''}
				onClick={handleOnClick}
				selected={selected}
			>
				<Tooltip
					directionalHint={DirectionalHint.rightCenter}
					styles={tooltipStyles}
					content={node.title}
					calloutProps={{ hidden: expanded }}
				>
					<ItemIcon iconName={node.icon} />
					{expanded ? node.title : ''}
				</Tooltip>
				{expanded ? children : null}
			</TreeItem>
			{!expanded ? children : null}
		</>
	)
})
