/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton, Stack, Text, TooltipHost } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'

import { isAddable } from '../../domain/CausalVariable.js'
import * as Graph from '../../domain/Graph.js'
import { VariableNature } from '../../domain/VariableNature.js'
import {
	CausalGraphConstraintsState,
	ConfidenceThresholdState,
	DatasetState,
	InModelCausalVariablesState,
	SelectedObjectState,
	useCausalGraph,
	WeightThresholdState,
} from '../../state/index.js'
import { Chart } from '../charts/Chart.js'
import { Divider } from '../controls/Divider.js'
import { VariableNaturePicker } from '../controls/VariableNaturePicker.js'
import { VariableCorrelationsList } from '../lists/CorrelationList.js'
import { EdgeList } from '../lists/EdgeList.js'
import {
	add_remove_button_styles,
	panel_stack_tokens,
} from './VariablePropertiesPanel.constants.js'
import type { VariablePropertiesPanelProps } from './VariablePropertiesPanel.types.js'

export const VariablePropertiesPanel: React.FC<VariablePropertiesPanelProps> =
	memo(function VariablePropertiesPanel({ variable }) {
		const dataset = useRecoilValue(DatasetState)
		const causalGraph = useCausalGraph()
		const weightThreshold = useRecoilValue(WeightThresholdState)
		const confidenceThreshold = useRecoilValue(ConfidenceThresholdState)
		const [, setSelectedObject] = useRecoilState(SelectedObjectState)

		const [inModelVariables, setInModelVariables] = useRecoilState(
			InModelCausalVariablesState,
		)

		const isInModel = Graph.includesVariable(causalGraph, variable)
		const relationships = Graph.validRelationshipsForColumnName(
			causalGraph,
			variable,
			weightThreshold,
			confidenceThreshold,
		)
		const [constraints, setConstraints] = useRecoilState(
			CausalGraphConstraintsState,
		)

		// TODO: DRY this out. It's also in CausalNode
		const addToModel = () => {
			const newInModelVariables = [...inModelVariables, variable]
			setInModelVariables(newInModelVariables)
		}

		const removeFromModel = () => {
			const newInModelVariables = inModelVariables.filter(
				inModelVariable => inModelVariable !== variable,
			)
			setInModelVariables(newInModelVariables)
		}

		return (
			<Container>
				<Text variant={'large'} block>
					{variable.name}
				</Text>
				<Chart table={dataset.table} variable={variable} />
				<Stack tokens={panel_stack_tokens}>
					<Text variant={'small'} block>
						{variable.description}
					</Text>
					<Stack horizontal tokens={{ childrenGap: 5 }}>
						<Stack.Item grow>
							<Text variant={'xSmall'} block>
								Sample Size: {variable.count}
							</Text>
							<Text variant={'xSmall'} block>
								Min: {variable.min}
							</Text>
							<Text variant={'xSmall'} block>
								Max: {variable.max}
							</Text>
						</Stack.Item>
						<Stack.Item grow>
							<Text variant={'xSmall'} block>
								Type: {variable.nature}
							</Text>
							<Text variant={'xSmall'} block>
								Mean: {variable.mean?.toFixed(3)}
							</Text>
							<Text variant={'xSmall'} block>
								Mode: {variable.mode}
							</Text>
						</Stack.Item>
					</Stack>
					<VariableNaturePicker variable={variable} />

					{variable.nature !== VariableNature.CategoricalNominal &&
						(isInModel ? (
							<TooltipHost content="Remove this variable from the causal model and recalculate">
								<PrimaryButton
									onClick={removeFromModel}
									primary
									styles={add_remove_button_styles}
								>
									Remove from model
								</PrimaryButton>
							</TooltipHost>
						) : (
							isAddable(variable) && (
								<TooltipHost content="Add this variable to the causal model and recalculate">
									<PrimaryButton
										onClick={addToModel}
										primary
										styles={add_remove_button_styles}
									>
										Add to model
									</PrimaryButton>
								</TooltipHost>
							)
						))}
				</Stack>
				<Divider>Edges</Divider>
				{relationships && (
					<EdgeList
						onSelect={setSelectedObject}
						variable={variable}
						relationships={relationships}
						constraints={constraints}
						onUpdateConstraints={setConstraints}
					/>
				)}

				<Divider>Correlations</Divider>
				<VariableCorrelationsList variable={variable} />
			</Container>
		)
	})

const Container = styled.div`
	padding: 8px;
`
