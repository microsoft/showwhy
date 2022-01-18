/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect, useState } from 'react'
import {
	useOnDefinitionChange,
	useOnRelevanceChange,
	useToggleInvalidValue,
} from './callbacks'
import { ColumnDetailsProps } from './interfaces'
import {
	useHistogramData,
	useInvalidValues,
	useIsSubjectIdentifierAvailable,
	useMissing,
	useRelation,
} from './variables'
import { ColumnRelevance } from '~enums'
import { useSetTableColumns, useTableColumns } from '~state'
import { GenericObject } from '~types'

export function useColumnDetails({
	columnName,
	values,
	fileId,
	onRemoveColumn,
}: ColumnDetailsProps): GenericObject {
	const tableColumns = useTableColumns(fileId)
	const setTableColumns = useSetTableColumns(fileId)
	const [relevance, setRelevance] = useState<ColumnRelevance | undefined>()

	const relation = useRelation(columnName, tableColumns)

	const invalidValues = useInvalidValues(columnName, tableColumns)

	const isSubjectIdentifierAvailable =
		useIsSubjectIdentifierAvailable(tableColumns)

	const histogramData = useHistogramData(columnName, values)

	const onRelevanceChange = useOnRelevanceChange({
		setTableColumns,
		tableColumns,
		setRelevance,
		relevance,
		columnName,
		onRemoveColumn,
	})

	const onDefinitionChange = useOnDefinitionChange({
		setTableColumns,
		tableColumns,
		columnName,
	})

	const toggleInvalidValue = useToggleInvalidValue({
		setTableColumns,
		tableColumns,
		columnName,
	})

	const missing = useMissing({
		values,
		columnName,
		invalidValues,
		toggleInvalidValue,
		tableColumns,
	})

	useEffect(() => {
		const newRelevance = tableColumns?.find(
			x => x.name === columnName,
		)?.relevance
		setRelevance(newRelevance)
	}, [columnName, tableColumns, setRelevance])

	return {
		missing,
		relation,
		relevance,
		histogramData,
		invalidValues,
		isSubjectIdentifierAvailable,
		onRelevanceChange,
		onDefinitionChange,
		toggleInvalidValue,
	}
}
