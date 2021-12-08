/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import React, { memo } from 'react'
import styled from 'styled-components'
import { ColumnHistogramTable } from '../ColumnHistogram'
import { ColumnRelevanceSelector } from '../ColumnRelevanceSelector'
import { useColumnDetails } from './hooks'
import { ColumnDetailsProps } from './interfaces'
import { InfoCallout } from '~components/Callout'

export const ColumnDetails: React.FC<ColumnDetailsProps> = memo(
	function ColumnDetails({ columnName, values, fileId, onRemoveColumn }) {
		const {
			missing,
			relation,
			relevance,
			histogramData,
			invalidValues,
			isSubjectIdentifierAvailable,
			onRelevanceChange,
			onDefinitionChange,
			toggleInvalidValue,
		} = useColumnDetails({ columnName, values, fileId, onRemoveColumn })

		return (
			<Container>
				<ColumnDetailsContainer>
					<ColumnStatisticsContainer>
						<SectionTitle>{columnName}</SectionTitle>
						<ColumnHistogramTable
							data={histogramData}
							onSelectInvalidChecked={toggleInvalidValue}
							invalidRows={invalidValues}
							totalValues={values?.length || 0}
						/>
						<MissingText>
							Missing: {missing.missing} {`(${missing.percentage}%)`}
							<InfoCallout title="Missing values">
								Values that aren&apos;t relevant for this column
							</InfoCallout>
						</MissingText>
					</ColumnStatisticsContainer>
					<RelevanceContainer>
						<SectionTitle>Relevance</SectionTitle>
						<RelevanceOptionsContainer>
							<ColumnRelevanceSelector
								isSubjectIdentifierAvailable={isSubjectIdentifierAvailable}
								relevance={relevance}
								relation={relation}
								onRelevanceChange={onRelevanceChange}
								onDefinitionChange={onDefinitionChange}
							/>
						</RelevanceOptionsContainer>
					</RelevanceContainer>
				</ColumnDetailsContainer>
			</Container>
		)
	},
)

const RelevanceContainer = styled.div``
const RelevanceOptionsContainer = styled.div`
	display: flex;
`

const Container = styled.div``

const ColumnDetailsContainer = styled.div`
	display: flex;
`

const ColumnStatisticsContainer = styled.div`
	width: 80%;
`

const SectionTitle = styled.h2`
	padding: 0px 6px;
`
const MissingText = styled.span`
	padding: 0px 6px;
`
