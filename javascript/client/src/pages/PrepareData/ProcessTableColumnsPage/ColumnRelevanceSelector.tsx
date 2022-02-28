/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import type { Maybe } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'
import { DefinitionRelationSelector } from './DefinitionRelationSelector'
import { ColumnRelation, ColumnRelevance } from '~types'

const RelevanceTypes = [
	{
		name: 'Not causally relevant; remove',
		value: ColumnRelevance.NotCausallyRelevant,
	},
	{
		name: 'Subject identifier',
		value: ColumnRelevance.SubjectIdentifier,
	},
	{
		name: 'Causally relevant to question',
		value: ColumnRelevance.CausallyRelevantToQuestion,
	},
]

export const ColumnRelevanceSelector: React.FC<{
	relevance: Maybe<ColumnRelevance>
	relation: ColumnRelation[]
	isSubjectIdentifierAvailable: boolean
	selectedColumn: string
	onRelevanceChange: (relevance: ColumnRelevance, column: string) => void
	onDefinitionChange: (
		changedRelation: ColumnRelation[],
		column: string,
	) => void
}> = memo(function ColumnRelevanceSelector({
	relevance,
	relation,
	isSubjectIdentifierAvailable,
	selectedColumn,
	onRelevanceChange,
	onDefinitionChange,
}) {
	return (
		<RelevanceOptionsContainer>
			{RelevanceTypes.map(r => {
				if (r.value === ColumnRelevance.CausallyRelevantToQuestion) {
					return (
						<DefinitionRelationSelector
							relation={relation}
							relevance={relevance}
							relevanceOption={r}
							key={r.value}
							onDefinitionChange={(changedRelation: ColumnRelation[]) =>
								onDefinitionChange(changedRelation, selectedColumn)
							}
						/>
					)
				}
				return (
					<RelevanceButton
						toggle
						checked={relevance === r.value}
						onClick={() => onRelevanceChange(r.value, selectedColumn)}
						key={r.value}
						title={
							r.value === ColumnRelevance.SubjectIdentifier &&
							!isSubjectIdentifierAvailable
								? 'Subject identifier already set for this table'
								: `Set relevance as ${ColumnRelevance[r.value]}`
						}
						disabled={
							r.value === ColumnRelevance.SubjectIdentifier &&
							!isSubjectIdentifierAvailable &&
							relevance !== r.value
						}
					>
						{r.name}
					</RelevanceButton>
				)
			})}
		</RelevanceOptionsContainer>
	)
})

const RelevanceOptionsContainer = styled.div``
const RelevanceButton = styled(DefaultButton)`
	width: 100%;
	margin-bottom: 8px;
`
