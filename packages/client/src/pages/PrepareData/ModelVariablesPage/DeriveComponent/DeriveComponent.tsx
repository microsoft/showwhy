/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown, TextField, DefaultButton, Checkbox } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { escape } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useState, useCallback, useMemo } from 'react'

import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { usePageType } from '../../../../hooks/usePageType'
import { DeriveTypes } from '~enums'
import {
	useCaptureTable,
	useFilterFunctions,
	useRemoveColumn,
	useSaveDefinition,
	useSetDeriveTable,
	useMatchFilter,
} from '~hooks'
import { Derive, ElementDefinition, FilterObject } from '~interfaces'

import {
	useModelVariables,
	useProjectFiles,
	useSetModelVariables,
	useAllTableColumns,
} from '~state'

export interface DeriveProps {
	selectedDefinition: string
	fileId: string
	originalTable: ColumnTable
	editing: FilterObject | undefined
	onClose: () => void
	onReset: () => void
	onSave: (definition: string) => void
	onUpdate: (evt, columnDetail) => void
}

export const DeriveComponent: React.FC<DeriveProps> = memo(
	function DeriveComponent({
		originalTable,
		selectedDefinition,
		fileId,
		onClose,
		editing,
		onReset,
		onSave,
		onUpdate,
	}) {
		const saveDefinition = useSaveDefinition()
		const projectFiles = useProjectFiles()
		const allTableColumns = useAllTableColumns(projectFiles)
		const modelVariables = useModelVariables(fileId)
		const removeColumn = useRemoveColumn(fileId)
		const setModelVariables = useSetModelVariables(fileId)
		const matchFilter = useMatchFilter()
		const type = usePageType()
		const [isNewDefinition, { toggle: toggleIsNewDefinition }] = useBoolean(
			modelVariables && modelVariables[type] ? false : true,
		)

		// TODO: most of these should just be pure functions called in a useCallback or useMemo
		const columnExists = useCallback(
			(name: string): boolean => {
				const existing = (modelVariables && modelVariables[type]) || []
				return (
					!!existing &&
					existing.flatMap(x => x.filters)?.find(f => f?.columnName === name)
				)
			},
			[modelVariables, type],
		)

		const definitionExists = useCallback(
			(name: string): boolean => {
				const existing = (modelVariables && modelVariables[type]) || []
				return !!existing && existing.find(x => x.name === name)
			},
			[modelVariables, type],
		)

		const nameExists = useCallback(
			(name: string): boolean => {
				return definitionExists(name) || columnExists(name)
			},
			[definitionExists, columnExists],
		)

		const columnName = useMemo((): string => {
			let num = 0
			if (!nameExists(selectedDefinition)) {
				return selectedDefinition
			}

			while (nameExists(`${selectedDefinition}_${num}`)) {
				num++
			}

			return selectedDefinition + '_' + num
		}, [selectedDefinition, nameExists])

		const [actualFilterValue, setActualFilterValue] =
			useState<FilterObject | null>(editing ?? { id: uuidv4(), columnName })

		const filterFunctions = useFilterFunctions()
		const setDeriveTable = useSetDeriveTable(fileId)
		const captureTable = useCaptureTable(fileId)

		const columns = useMemo((): { key: string; text: string }[] => {
			return (
				allTableColumns
					.flatMap(x => x)
					// .filter(x => x?.tableId === actualFilterValue?.tableId)
					.map(x => {
						return {
							key: x?.name as string,
							text: x?.name as string,
						}
					})
			)
		}, [allTableColumns])

		const filterArquero = useCallback(
			filterValue => {
				let tableFiltered = originalTable
				if (filterValue) {
					tableFiltered = originalTable?.filter(
						escape((arqueroRow: ColumnTable) => {
							return matchFilter(arqueroRow, filterValue, actualFilterValue)
						}),
					) as ColumnTable
				}
				captureTable(
					tableFiltered as ColumnTable,
					actualFilterValue?.columnName as string,
				)
			},
			[matchFilter, originalTable, actualFilterValue, captureTable],
		)

		const onCreateNewDefinition = useCallback(
			(filterValue: any, existing) => {
				const newObj = {
					name: actualFilterValue?.columnName,
					filters: [filterValue],
				}

				const definitionObj = {
					...modelVariables,
					[type]: [...existing, newObj],
				}

				const newDefinition = {
					level: 'Secondary',
					variable: actualFilterValue?.columnName,
					description: '',
					column: actualFilterValue?.columnName,
					id: uuidv4(),
				} as ElementDefinition
				saveDefinition(newDefinition)
				setModelVariables(definitionObj)
				onSave(actualFilterValue?.columnName as string)
			},
			[
				actualFilterValue,
				modelVariables,
				type,
				saveDefinition,
				setModelVariables,
				onSave,
			],
		)

		const save = useCallback(
			filterValue => {
				const existingVariables = (modelVariables && modelVariables[type]) || []
				if (isNewDefinition) {
					return onCreateNewDefinition(filterValue, existingVariables)
				}

				const existingDefinition = {
					...(existingVariables.find(x => x.name === selectedDefinition) || {
						name: selectedDefinition,
					}),
				}

				existingDefinition.filters = [
					...(existingDefinition?.filters?.filter(
						x => x.id !== filterValue.id,
					) || []),
					filterValue,
				]
				const definitionObj = {
					...modelVariables,
					[type]: [
						...existingVariables.filter(x => x.name !== selectedDefinition),
						existingDefinition,
					],
				}

				onUpdate(null, { text: actualFilterValue?.columnName })
				setModelVariables(definitionObj)
			},
			[
				actualFilterValue,
				modelVariables,
				isNewDefinition,
				type,
				selectedDefinition,
				setModelVariables,
				onCreateNewDefinition,
				onUpdate,
			],
		)

		const resetDerive = useCallback(() => {
			setActualFilterValue(null)
			onClose()
			onReset()
		}, [setActualFilterValue, onClose, onReset])

		const filterData = useCallback(() => {
			if (actualFilterValue && !actualFilterValue?.id) {
				actualFilterValue.id = uuidv4()
			}
			save(actualFilterValue)
			filterArquero(actualFilterValue)
			resetDerive()
		}, [actualFilterValue, filterArquero, save, resetDerive])

		const rankData = useCallback(() => {
			const derive = {
				id: uuidv4(),
				column: actualFilterValue?.column,
				columnName: actualFilterValue?.columnName?.toString(),
				threshold: actualFilterValue?.value,
				type: actualFilterValue?.filter,
			} as Derive
			setDeriveTable(derive)
			save(actualFilterValue)
			resetDerive()
		}, [setDeriveTable, actualFilterValue, resetDerive, save])

		const deriveData = useCallback(() => {
			if (editing) {
				const oldColumnName =
					modelVariables &&
					modelVariables[type]
						?.flatMap(x => x.filters)
						.find(x => x.id === actualFilterValue?.id)
				removeColumn(oldColumnName.columnName)
			}

			if (
				actualFilterValue?.filter === DeriveTypes.PercentageTopRanking ||
				actualFilterValue?.filter === DeriveTypes.PercentageBottomRanking
			) {
				return rankData()
			}
			return filterData()
		}, [
			filterData,
			rankData,
			editing,
			modelVariables,
			actualFilterValue,
			removeColumn,
			type,
		])

		const addFilterValues = (event, option) => {
			const field = event.target.title
			const val = option?.key || option.text || option
			const obj = {
				...actualFilterValue,
				[field]: val,
			} as FilterObject

			setActualFilterValue(obj)
		}

		const toggleValue = (field, value) => {
			const obj = {
				...actualFilterValue,
				[field]: value,
			} as FilterObject

			setActualFilterValue(obj)
		}

		const toggleNewDefinition = useCallback(() => {
			if (
				!isNewDefinition &&
				nameExists(actualFilterValue?.columnName as string)
			) {
				setActualFilterValue(
					prev =>
						({
							...prev,
							columnName: prev?.columnName + '_new',
						} as FilterObject),
				)
			}
			toggleIsNewDefinition()
		}, [
			toggleIsNewDefinition,
			setActualFilterValue,
			actualFilterValue,
			isNewDefinition,
			nameExists,
		])

		return (
			<Container>
				<FilterOptionsContainer>
					<TextField
						title="columnName"
						type="text"
						label="New column name"
						value={actualFilterValue?.columnName || ''}
						onChange={addFilterValues}
					/>
					<Div style={{ display: 'flex' }}>
						{/* <DropdownFilter
							style={{ marginRight: '12px' }}
							label="Table"
							placeholder="Select the table"
							options={tables}
							title="tableId"
							onChange={addFilterValues}
							selectedKey={actualFilterValue?.tableId}
						/> */}
						<DropdownFilter
							style={{ marginRight: '12px' }}
							label="Column"
							placeholder="Select the column"
							options={columns}
							title="column"
							onChange={addFilterValues}
							selectedKey={actualFilterValue?.column}
						/>
						<DropdownFilter
							label="Function"
							placeholder="Select the function"
							options={filterFunctions}
							title="filter"
							onChange={addFilterValues}
							selectedKey={actualFilterValue?.filter}
						/>
					</Div>
					{actualFilterValue?.filter?.endsWith('in range') ? (
						<DivRange>
							<ToggleButton
								checked={actualFilterValue.inclusive}
								onClick={() =>
									toggleValue('inclusive', !actualFilterValue?.inclusive)
								}
								title="inclusive"
							>
								Inclusive
							</ToggleButton>
							<RangeField
								defaultValue={actualFilterValue?.lower?.toString()}
								title="lower"
								placeholder="lower"
								onChange={addFilterValues}
							/>
							<RangeField
								defaultValue={actualFilterValue?.upper?.toString()}
								title="upper"
								placeholder="upper"
								onChange={addFilterValues}
							/>
							<CheckboxDefinition
								disabled={!!editing}
								defaultChecked={isNewDefinition}
								label="Set as new definition"
								onChange={toggleNewDefinition}
							/>
						</DivRange>
					) : (
						<Div>
							<ValueField
								title="value"
								label="Value"
								type="text"
								placeholder={
									filterFunctions.find(x => x.key === actualFilterValue?.filter)
										?.placeholder || 'Type the value'
								}
								value={(actualFilterValue?.value as string) || ''}
								onChange={addFilterValues}
							/>
							<CheckboxDefinition
								disabled={!!editing}
								checked={isNewDefinition}
								label="Set as new definition"
								onChange={toggleNewDefinition}
							/>
						</Div>
					)}
					<DivCenter>
						<CancelButton onClick={resetDerive}>Cancel</CancelButton>

						<ApplyButton
							disabled={
								!actualFilterValue?.value?.toString().length &&
								!actualFilterValue?.lower?.toString().length &&
								!actualFilterValue?.upper?.toString().length
							}
							onClick={deriveData}
						>
							Apply
						</ApplyButton>
					</DivCenter>
				</FilterOptionsContainer>
			</Container>
		)
	},
)

const ValueField = styled(TextField)`
	width: 47.5%;
`

const CheckboxDefinition = styled(Checkbox)`
	margin-top: 8px;
	align-self: end;
	margin-left: 13px;
	margin-bottom: 8px;
`
const ApplyButton = styled(DefaultButton)`
	margin-top: 16px;
`
const CancelButton = styled(DefaultButton)`
	margin-top: 16px;
	margin-right: 16px;
`
const FilterOptionsContainer = styled.div``

const Container = styled.div`
	align-items: center;
	padding-top: 8px;
`

const DropdownFilter = styled(Dropdown)`
	width: 50%;
`

const Div = styled.div`
	display: flex;
`

const DivCenter = styled(Div)`
	justify-content: center;
`

const DivRange = styled(Div)`
	margin-top: 10px;
`

const ToggleButton = styled(DefaultButton)`
	margin-right: 8px;
`

const RangeField = styled(TextField)`
	margin-right: 8px;
	width: 18%;
`
