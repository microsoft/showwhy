/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step } from '@data-wrangling-components/core'
import { createDefaultCommandBar } from '@data-wrangling-components/react'
import { BaseFile, createBaseFile } from '@data-wrangling-components/utilities'
import {
	ICommandBarItemProps,
	IDetailsColumnProps,
	IRenderFunction,
} from '@fluentui/react'
import { useCallback, useMemo, useState } from 'react'
import {
	useProjectFiles,
	useSetStepsTablePrep,
	useSetTableColumns,
	useStepsTablePrep,
	useTableColumns,
} from '~state'
import { ColumnRelevance, Maybe, Setter, TableColumn } from '~types'

export function useBusinessLogic(): {
	files: BaseFile[]
	steps?: Step[]
	onChangeSteps: (step: Step[]) => void
	commandBar: IRenderFunction<IDetailsColumnProps>
} {
	const projectFiles = useProjectFiles()
	const steps = useStepsTablePrep()
	const setStepsTablePrep = useSetStepsTablePrep()

	const [relevance, setRelevance] = useState<Maybe<ColumnRelevance>>()
	const tableColumns = useTableColumns('identifier') //default any key
	const setTableColumns = useSetTableColumns('identifier')

	const onChangeSteps = useCallback(
		(step: Step[]) => {
			setStepsTablePrep(step)
		},
		[setStepsTablePrep],
	)

	const files = useMemo((): BaseFile[] => {
		return projectFiles.map(x => {
			const file = new Blob([x.content], {
				type: 'text/csv',
			})
			return createBaseFile(file, { name: x.name })
		})
	}, [projectFiles])

	const onRelevanceChange = useOnRelevanceChange({
		setTableColumns,
		tableColumns,
		setRelevance,
		relevance,
	})

	const subjectIdentifier = useMemo(
		(): TableColumn | undefined =>
			tableColumns?.find(
				x => x.relevance === ColumnRelevance.SubjectIdentifier,
			),
		[tableColumns],
	)

	const commandBar = useCallback(
		(props?: IDetailsColumnProps) => {
			const columnName = props?.column.name
			const items: ICommandBarItemProps[] = [
				{
					key: 'newItem',
					text: 'Set as subject identifier',
					iconOnly: true,
					iconProps: { iconName: 'Permissions' },
					toggle: true,
					disabled: subjectIdentifier && subjectIdentifier?.name !== columnName,
					checked: subjectIdentifier?.name === columnName,
					onClick: () =>
						onRelevanceChange(ColumnRelevance.SubjectIdentifier, columnName),
				},
			]
			return createDefaultCommandBar(items)
		},
		[onRelevanceChange, subjectIdentifier],
	)

	return {
		files,
		onChangeSteps,
		steps,
		commandBar,
	}
}

export function useOnRelevanceChange({
	setTableColumns,
	tableColumns,
	setRelevance,
	relevance,
	onRemoveColumn,
}: {
	setTableColumns: Setter<Maybe<TableColumn[]>>
	tableColumns?: TableColumn[]
	setRelevance: Setter<Maybe<ColumnRelevance>>
	relevance?: ColumnRelevance
	onRemoveColumn?: (columnName?: string) => void
}): (changedRelevance: Maybe<ColumnRelevance>, columnName?: string) => void {
	return useCallback(
		(changedRelevance: Maybe<ColumnRelevance>, columnName?: string) => {
			if (relevance === changedRelevance) {
				changedRelevance = undefined
			}

			setRelevance(changedRelevance)
			const column = {
				...tableColumns?.find(a => a.name === columnName),
				name: columnName,
				relevance: changedRelevance,
			} as TableColumn

			if (changedRelevance === ColumnRelevance.SubjectIdentifier) {
				column.isDone = true
			} else {
				column.isDone = false
			}

			const newArray = [
				...(tableColumns?.filter(a => a.name !== columnName) || []),
			]
			newArray.push(column)
			setTableColumns(newArray)
			if (changedRelevance === ColumnRelevance.NotRelevant) {
				onRemoveColumn && onRemoveColumn(undefined)
			}
		},
		[setTableColumns, tableColumns, setRelevance, relevance, onRemoveColumn],
	)
}
