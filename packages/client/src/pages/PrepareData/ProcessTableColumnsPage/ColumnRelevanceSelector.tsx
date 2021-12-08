/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { DefinitionRelationSelector } from './DefinitionRelationSelector'
import { ColumnRelation, ColumnRelevance } from '~enums'

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

interface ColumnRelevanceSelectorProps {
	relevance: ColumnRelevance | undefined
	relation: ColumnRelation[]
	isSubjectIdentifierAvailable: boolean
	onRelevanceChange: (relevance: ColumnRelevance) => void
	onDefinitionChange: (changedRelation: ColumnRelation[]) => void
}

export const ColumnRelevanceSelector: React.FC<ColumnRelevanceSelectorProps> =
	memo(function ColumnRelevanceSelector({
		relevance,
		relation,
		isSubjectIdentifierAvailable,
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
								onDefinitionChange={onDefinitionChange}
							/>
						)
					}
					return (
						<RelevanceButton
							toggle
							checked={relevance === r.value}
							onClick={() => onRelevanceChange(r.value)}
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

const RelevanceOptionsContainer = styled.div`
	padding: 0px 16px;
`
const RelevanceButton = styled(DefaultButton)`
	width: 100%;
	margin-bottom: 8px;
`
