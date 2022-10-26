/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	IColumn,
	IDetailsColumnFieldProps,
	IDetailsListProps,
	IDetailsRowStyles,
} from '@fluentui/react'
import { DetailsRow } from '@fluentui/react'
import styled from 'styled-components'

import type { Header } from '../types/Header.js'

export function onRenderField(props?: IDetailsColumnFieldProps): JSX.Element {
	//eslint-disable-next-line
	const { item, column } = props || {}
	return (
		<Cell key={column?.key} width={column?.minWidth || 0}>
			{/* eslint-disable-next-line */}
			{item[column?.fieldName || '']}
		</Cell>
	)
}

export const onRenderRow: IDetailsListProps['onRenderRow'] = props => {
	const styles: Partial<IDetailsRowStyles> = {
		cell: {
			border: '1px solid #fff',
			fontSize: '14px',
		},
	}

	if (props) {
		//eslint-disable-next-line
		const { dataPw = 'details-list-row' } = props.item
		if (props.itemIndex % 2 === 0) {
			styles.root = {
				backgroundColor: 'var(--faint)',
			}
		}

		//eslint-disable-next-line
		return <DetailsRow data-pw={dataPw} {...props} styles={styles} />
	}
	return null
}

export function getColumns(headers: Header[]): IColumn[] {
	return headers.map(h => ({
		key: h.fieldName,
		fieldName: h.fieldName,
		name: h.name,
		ariaLabel: h.name,
		minWidth: h.width,
		maxWidth: h.width,
		styles: {
			root: {
				padding: 1,
				width: `${h.width}px !important`,
			},
			cellTooltip: {
				display: 'flex',
				justifyContent: 'center',
				border: '1px solid #fff',
				background: 'var(--faint)',
			},
			cellName: {
				fontSize: '15px',
				fontWeight: 'bold',
			},
		},
	})) as IColumn[]
}

const Cell = styled.div<{ width: number }>`
	width: ${({ width }) => (width ? `${width}px` : 'auto')};
	padding: 0.5rem;
	font-size: 14px;
	white-space: break-spaces;
	border: 1px solid #fff;
`
