/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import type { Definition, FilterObject } from '@showwhy/types'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useRemoveColumn } from '~hooks'
import { useModelVariables, useSetModelVariables } from '~state'
import { TableDerivationType } from '~types'

export const DefinitionSteps: React.FC<{
	fileId: string
	selectedDefinition: string
	type: string
	onEdit: (filter: FilterObject) => void
}> = memo(function DefinitionSteps({
	fileId,
	selectedDefinition,
	type,
	onEdit,
}) {
	const modelVariables = useModelVariables(fileId)
	const setModelVariables = useSetModelVariables(fileId)
	const removeColumn = useRemoveColumn(fileId)

	const filterValues = useMemo((): FilterObject[] => {
		let newValues = [] as FilterObject[]
		if (modelVariables && modelVariables[type]) {
			newValues =
				modelVariables[type]?.find(v => v.name === selectedDefinition)
					?.filters ?? []
		}
		return newValues
	}, [modelVariables, type, selectedDefinition])

	const filterType = useCallback((filter): string => {
		if (filter.filter === TableDerivationType.PercentageTopRanking) {
			return ' in top ' + filter?.value + '%'
		} else if (filter.filter === TableDerivationType.PercentageBottomRanking) {
			return ' in bottom ' + filter?.value + '%'
		}
		return ' ' + filter?.filter + ' ' + filter?.value
	}, [])

	const deleteClause = useCallback(
		(filter: FilterObject) => {
			const existing = (modelVariables && modelVariables[type]) || []
			const definition = {
				...existing.find(x => x.name === selectedDefinition),
			}
			definition.filters =
				definition.filters?.filter(x => x.id !== filter.id) ?? []
			const modelVariable = {
				...modelVariables,
				[type]: [
					...existing.filter(x => x.name !== selectedDefinition),
					definition,
				],
			}

			setModelVariables(modelVariable as Definition)
			removeColumn(filter.columnName as string)
		},
		[modelVariables, removeColumn, setModelVariables, type, selectedDefinition],
	)

	return (
		<Container>
			<FilterListContainer>
				{filterValues.map((filter, key) => {
					return (
						<FilterClause key={key}>
							{filter?.columnName}: {filter?.column}
							{filterType(filter)}
							<IconButton
								iconProps={{ iconName: 'Edit' }}
								title="Edit"
								ariaLabel="Edit Emoji"
								onClick={() => onEdit(filter)}
							/>
							<IconButton
								iconProps={{ iconName: 'Delete' }}
								title="Delete"
								ariaLabel="Delete Emoji"
								onClick={() => deleteClause(filter)}
							/>
						</FilterClause>
					)
				})}
			</FilterListContainer>
		</Container>
	)
})

const Container = styled.div``

const FilterListContainer = styled.div`
	text-align: left;
`

const FilterClause = styled.div``
