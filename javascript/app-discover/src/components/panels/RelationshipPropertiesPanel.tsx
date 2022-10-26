/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton, Separator, Text, TooltipHost } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'

import { variableForColumnName } from '../../domain/Dataset.js'
import {
	CausalGraphConstraintsState,
	DatasetState,
	FilteredCorrelationsState,
} from '../../state/index.js'
import { correlationForVariables } from '../../utils/Correlation.js'
import { ComparisonChart } from '../charts/ComparisonChart.js'
import { remove_button_styles } from './RelationshipPropertiesPanel.constants.js'
import type { RelationshipPropertiesPanelProps } from './RelationshipPropertiesPanel.types.js'

export const RelationshipPropertiesPanel: React.FC<RelationshipPropertiesPanelProps> =
	memo(function RelationshipPropertiesPanel({ relationship }) {
		const dataset = useRecoilValue(DatasetState)
		const correlations = useRecoilValue(FilteredCorrelationsState)
		const correlation = correlationForVariables(
			correlations,
			relationship.source,
			relationship.target,
		)
		const [constraints, setConstraints] = useRecoilState(
			CausalGraphConstraintsState,
		)
		const sourceVariable = variableForColumnName(
			dataset,
			relationship.source.columnName,
		)
		const targetVariable = variableForColumnName(
			dataset,
			relationship.target.columnName,
		)
		const sourceAndTargetExistInDataset = sourceVariable && targetVariable

		const addToConstraints = () => {
			const newConstraints = {
				...constraints,
				manualRelationships: [...constraints.manualRelationships, relationship],
			}
			setConstraints(newConstraints)
		}

		return (
			<Container>
				<Text variant={'large'} block>
					{relationship.name}
				</Text>
				{sourceAndTargetExistInDataset && (
					<ComparisonChart
						table={dataset.table}
						sourceVariable={sourceVariable}
						targetVariable={targetVariable}
					/>
				)}
				<Separator></Separator>
				{relationship.weight !== undefined && (
					<Text variant={'small'} block>
						Normalized Causal Weight: {relationship.weight.toFixed(3)}
					</Text>
				)}
				<Text variant={'small'} block>
					Sample Size: {correlation ? correlation.sampleSize : 0}
				</Text>
				<Text variant={'small'} block>
					Correlation:{' '}
					{correlation ? correlation.weight.toFixed(3) : 'insignificant'}
				</Text>
				<Separator>Constraints</Separator>
				<TooltipHost content="This relationship is incorrect or unwanted">
					<PrimaryButton
						onClick={addToConstraints}
						styles={remove_button_styles}
					>
						Remove relationship
					</PrimaryButton>
				</TooltipHost>
			</Container>
		)
	})

const Container = styled.div`
	padding: 8px;
`
