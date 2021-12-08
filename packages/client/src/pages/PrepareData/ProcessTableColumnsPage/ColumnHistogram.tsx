/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox } from '@fluentui/react'
import { DataValue } from 'arquero/dist/types/table/table'
import React, { memo, useMemo } from 'react'

import styled from 'styled-components'
import { GenericTableComponent } from '~components/Tables/GenericTableComponent'
import { Item } from '~interfaces'

interface ColumnHistogramTableProps {
	onSelectInvalidChecked: (value: string) => void
	invalidRows: (string | null)[]
	totalValues: number | 0
	data: { name: string; count: DataValue }[]
}

export const ColumnHistogramTable: React.FC<ColumnHistogramTableProps> = memo(
	function ColumnHistogramTable({
		onSelectInvalidChecked,
		invalidRows,
		totalValues,
		data,
	}) {
		const orderedData = useOrderedData(data, totalValues)

		const itemList = useItems(orderedData, onSelectInvalidChecked, invalidRows)

		return (
			<Container>
				<GenericTableComponent
					headers={headers}
					items={itemList}
					props={{ styles: { height: '190px' } }}
				/>
			</Container>
		)
	},
)

const useOrderedData = (data, totalValues) => {
	return useMemo(() => {
		const mappedData = data.map(row => {
			return {
				percentage: Math.round(100 * (row.count / totalValues)),
				count_one: Math.round(100 * (row.count / totalValues)),
				count: row.count,
				name: row.name,
			}
		})
		return mappedData.sort(function (a, b) {
			return b.count_one - a.count_one
		})
	}, [data, totalValues])
}

const useItems = (orderedData, onSelectInvalidChecked, invalidRows) => {
	return useMemo((): Item[] => {
		return orderedData.map(row => ({
			value: row.name,
			count: (
				<Histogram fillPercentage={row.percentage}>
					{row.count} ({row.count_one}%)
				</Histogram>
			),
			isMissing: (
				<Checkbox
					checked={invalidRows.includes(row.name) || invalidRows.includes(null)}
					onChange={() => onSelectInvalidChecked(row.name)}
				/>
			),
		}))
	}, [orderedData, onSelectInvalidChecked, invalidRows])
}

const headers = {
	data: [
		{ fieldName: 'value', value: 'Value' },
		{ fieldName: 'count', value: 'Count' },
		{ fieldName: 'isMissing', value: 'Is missing' },
	],
}

const Container = styled.div`
	height: 200px;
	overflow: hidden;
`

const Histogram = styled.div<{ fillPercentage: number }>`
	border: 1px solid ${({ theme }) => theme.application().border};
	background-image: linear-gradient(
		left,
		cornflowerblue,
		cornflowerblue ${h => h.fillPercentage}%,
		transparent ${h => h.fillPercentage}%,
		transparent 100%
	);
	background-image: -webkit-linear-gradient(
		left,
		cornflowerblue,
		cornflowerblue ${h => h.fillPercentage}%,
		transparent ${h => h.fillPercentage}%,
		transparent 100%
	);
`
