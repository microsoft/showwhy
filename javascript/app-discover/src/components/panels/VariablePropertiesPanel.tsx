/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ButtonChoiceGroup } from '@essex/components'
import type { IChoiceGroupOption, ITheme } from '@fluentui/react'
import { Label, PrimaryButton, Stack, Text, TooltipHost } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'

import {
	Constraints,
	getConstraintType,
	updateConstraints,
} from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
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

		const constraintChooserOptions: IChoiceGroupOption[] = [
			{
				key: Constraints.Cause,
				text: 'Cause',
				iconProps: { iconName: 'AlignHorizontalLeft' },
			} as IChoiceGroupOption,
			{
				key: Constraints.Effect,
				text: 'Effect',
				iconProps: { iconName: 'AlignHorizontalRight' },
			} as IChoiceGroupOption,
		]

		const onChange = (
			e?: React.FormEvent<HTMLElement | HTMLInputElement>,
			option?: IChoiceGroupOption,
		): void => {
			setConstraints(
				updateConstraints(
					constraints,
					variable,
					Constraints[option?.key as keyof typeof Constraints],
				),
			)
		}

		return (
			<Container>
				<Section>
					<Text variant={'medium'} block>
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
				</Section>
				<Section>
					<Divider>Edges</Divider>
					{isInModel && (
						<>
							<Label style={buttonChoiceStyle}>Constraint</Label>
							<ButtonChoiceGroup
								style={buttonChoiceStyle}
								selectedKey={getConstraintType(constraints, variable)}
								onChange={onChange}
								options={constraintChooserOptions}
							/>
						</>
					)}
					{relationships && (
						<EdgeList
							onSelect={setSelectedObject}
							variable={variable}
							relationships={relationships}
							constraints={constraints}
							onUpdateConstraints={setConstraints}
						/>
					)}
				</Section>
				<Section>
					<Divider>Correlations</Divider>
					<VariableCorrelationsList variable={variable} />
				</Section>
			</Container>
		)
	})

const Container = styled.div``

const buttonChoiceStyle = { textAlign: 'center' } as React.CSSProperties

export const Section = styled.div`
	padding: 8px;
	border-bottom: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralTertiaryAlt};
`
