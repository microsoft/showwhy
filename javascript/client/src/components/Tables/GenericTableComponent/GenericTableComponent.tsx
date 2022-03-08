/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon, IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import type { Handler, Maybe } from '@showwhy/types'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ActionButtons } from '~components/ActionButtons'
import { useDefaultTableSample } from '~hooks'
import type { HeaderData, Item, TableFooter, TableProps } from '~types'
import { sortByField } from '~utils'

interface GenericHeader {
	data: HeaderData[]
	props?: any
}

export const GenericTableComponent: React.FC<{
	headers?: GenericHeader
	props?: TableProps
	tableTitle?: string | React.ReactNode
	onColumnClick?: (column: string) => void
	items: Item[]
	selectedColumn?: string
	isCompactMode?: Maybe<boolean>
	footer?: TableFooter
}> = memo(function GenericTableComponent({
	items,
	headers = {
		data: [],
		props: {},
	},
	tableTitle,
	selectedColumn,
	isCompactMode = false,
	footer,
	props = {
		styles: {},
	},
	onColumnClick,
}) {
	const tableSample = useDefaultTableSample()
	const [sortBy, setSortBy] = useState('')
	const [sortAscending, { toggle: toggleAscending }] = useBoolean(true)
	const [sortedItems, setSortedItems] = useState<Item[]>([])
	const [selectedRow, setSelectedRow] = useState('')

	const colSpan = useMemo((): number => {
		if (tableTitle) {
			const [item] = items
			delete item!.onClick
			delete item!.ref
			const keys = Object.keys(item!)
			return keys.length
		}
		return 0
	}, [items, tableTitle])

	const sortItems = useCallback(
		(column: string, asc?: boolean) => {
			const sortBy = sortByField(column, asc)
			const sorted = [...items]
			sorted.sort(sortBy)
			setSortedItems(sorted.slice(0, tableSample))
		},
		[items, setSortedItems, tableSample],
	)

	const onSort = useCallback(
		(columnName: string) => {
			let asc = sortAscending
			if (sortBy === columnName) {
				toggleAscending()
				asc = !asc
			}
			setSortBy(columnName)
			sortItems(columnName, asc)
		},
		[setSortBy, sortAscending, sortBy, toggleAscending, sortItems],
	)

	const onSelectedRow = useCallback(
		(id: string, _row: any, onClick: Handler) => {
			setSelectedRow(id)
			onClick()
		},
		[],
	)

	useEffect(() => {
		if (items?.length) setSortedItems([...items].slice(0, tableSample))
	}, [items, setSortedItems, tableSample])

	if (!items?.length) return null

	if (!headers.props) {
		headers.props = {}
	}
	if (!headers.props?.hasOwnProperty('isSticky')) {
		headers.props.isSticky = true
	}
	if (!headers.props?.hasOwnProperty('styles')) {
		headers.props.styles = {}
	}
	if (!headers.props?.hasOwnProperty('isVisible')) {
		headers.props.isVisible = true
	}
	if (!headers.props?.hasOwnProperty('isSortable')) {
		headers.props.isSortable = false
	}

	const tHeadContent = headers.data.map((h, i) => {
		return (
			<HeaderCell
				key={i}
				isCompactMode={isCompactMode}
				onClick={() => onColumnClick && onColumnClick(h.fieldName)}
				isClickable={!!onColumnClick}
				isSelected={!!onColumnClick && h.fieldName === selectedColumn}
				style={{
					width: props?.customColumnsWidth?.find(
						c => c.fieldName === h.fieldName,
					)?.width,
				}}
			>
				{h.value}
				{headers?.props?.isSortable ? (
					<IconButton
						iconProps={{
							iconName:
								sortAscending && sortBy === h.fieldName
									? 'SortDown'
									: sortBy === h.fieldName
									? 'SortUp'
									: 'Sort',
						}}
						title="Sort"
						ariaLabel="Sort Emoji"
						onClick={() => onSort(h.fieldName)}
					/>
				) : null}
				{h.iconName ? <FontIcon iconName={h.iconName} /> : null}
			</HeaderCell>
		)
	})

	const tBodyContent = sortedItems.map((item, i) => {
		const { onClick, ref, colSpan, dataPw } = item
		const excluded = ['ref', 'onClick', 'colSpan']
		const id = item['id'] || i.toString()
		const keys = (
			(headers?.data.length && headers?.data.map(h => h.fieldName)) ||
			Object.keys(item)
		).filter(k => !excluded.includes(k))
		return (
			<Row
				key={i}
				ref={ref}
				onClick={() => onClick && onSelectedRow(id, item, onClick)}
				isClickable={!!onClick}
				isSelected={onClick && selectedRow === id}
				data-pw={dataPw || 'generic-table-row'}
			>
				{keys.map(
					(key, i) =>
						item.hasOwnProperty(key) && (
							<Cell
								key={i}
								isCompactMode={isCompactMode}
								onClick={() => onColumnClick && onColumnClick(key)}
								isClickable={!!onColumnClick}
								isSelected={!!onColumnClick && key === selectedColumn}
								colSpan={colSpan}
							>
								{key.toLowerCase() === 'actions' && item[key] ? (
									<ActionButtons
										onCancel={item[key].onCancel}
										onSave={item[key].onSave}
										onEdit={item[key].onEdit}
										onDelete={item[key].onDelete}
										onDuplicate={item[key].onDuplicate}
										onFavorite={item[key].onFavorite}
										infoButton={item[key].infoButton}
										favoriteProps={item[key].favoriteProps}
										disableSave={item[key].disableSave}
									/>
								) : (
									item[key]
								)}
							</Cell>
						),
				)}
			</Row>
		)
	})

	return (
		<Container style={props.styles}>
			<Table>
				{headers?.props?.isVisible && tHeadContent?.length ? (
					<THead
						style={headers?.props?.styles}
						isSticky={headers?.props?.isSticky}
						isCompactMode={isCompactMode}
					>
						{tableTitle ? (
							<Row>
								<HeaderCell colSpan={colSpan} style={{ textAlign: 'left' }}>
									{tableTitle}
								</HeaderCell>
							</Row>
						) : null}
						<Row style={{ backgroundColor: 'transparent' }}>{tHeadContent}</Row>
					</THead>
				) : null}
				<TBody>{tBodyContent}</TBody>
				{footer ? (
					<TFooter>
						<Row>{footer}</Row>
					</TFooter>
				) : null}
			</Table>
		</Container>
	)
})

const Table = styled.table`
	border-collapse: collapse;
	width: 100%;
`
const Container = styled.section`
	min-width: 100%;
	overflow: auto;
	// width: max-content;
	max-height: 95vh;
	margin: 1rem 0 0;
`
const THead = styled.thead<{
	isSticky?: Maybe<boolean>
	isCompactMode?: Maybe<boolean>
}>`
	${({ isSticky }) =>
		!isSticky
			? ''
			: `
		position: sticky;
		position: -webkit-sticky;
		z-index: 2;
		top: 0;
	`}
	font-weight: bold;
	border-bottom: 2px solid white;
	text-align: center;
	font-size: ${({ isCompactMode }) => (isCompactMode ? '13px' : '15px')};
	background-color: ${({ theme }) => theme.application().faint};
`
const TBody = styled.tbody``
const TFooter = styled.tfoot``
const Row = styled.tr<{
	isSelected?: Maybe<boolean>
	isClickable?: Maybe<boolean>
}>`
	width: 100%;
	:nth-child(odd) {
		background-color: ${({ theme }) => theme.application().faint};
	}
	${({ isClickable }) => (isClickable ? 'cursor: pointer;' : '')};
	${({ isSelected }) => (isSelected ? 'font-weight: bold;' : '')};
	color: ${({ theme, isSelected }) =>
		isSelected ? theme.application().accent : ''};
`
const Cell = styled.td<{
	isCompactMode?: Maybe<boolean>
	isClickable?: Maybe<boolean>
	isSelected?: Maybe<boolean>
}>`
	flex: 1;
	border-right: 2px solid white;
	:nth-last-child(1) {
		text-align: center;
	}
	${({ isCompactMode }) => (isCompactMode ? 'font-size: 12px' : '')};
	padding: ${({ isCompactMode }) => (isCompactMode ? '0.2rem' : '0.5rem')};
	${({ isClickable }) => (isClickable ? 'cursor: pointer;' : '')}
	color: ${({ theme, isSelected }) =>
		isSelected ? theme.application().accent : ''};
	font-weight: ${({ isSelected }) => (isSelected ? 'bolder' : 'normal')};
`
const HeaderCell = styled.th<{
	isCompactMode?: Maybe<boolean>
	isClickable?: Maybe<boolean>
	isSelected?: Maybe<boolean>
}>`
	flex: 1;
	white-space: nowrap;
	border-right: 2px solid white;
	padding: ${({ isCompactMode }) => (isCompactMode ? '0.2rem' : '0.5rem')};
	${({ isClickable }) => (isClickable ? 'cursor: pointer;' : '')}
	color: ${({ theme, isSelected }) =>
		isSelected ? theme.application().accent : ''};
`
