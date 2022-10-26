/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DialogConfirm } from '@essex/components'
import type {
	IChoiceGroupOption,
	IChoiceGroupOptionProps,
	IRenderFunction,
} from '@fluentui/react'
import {
	ChoiceGroup,
	PrimaryButton,
	Stack,
	Text,
	TooltipHost,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useCallback, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'

import {
	Constraints,
	getConstraintType,
	updateConstraints,
} from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import { isAddable } from '../../domain/CausalVariable.js'
import * as Graph from '../../domain/Graph.js'
import { involvesVariable } from '../../domain/Relationship.js'
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
		const [
			showDialogConfirm,
			{ toggle: toggleDialogConfirm, setFalse: closeDialogConfirm },
		] = useBoolean(false)
		const [constraintOption, setConstraintOption] = useState('')
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

		const onUpdateConstraints = useCallback(
			(constraintKey?: string) => {
				setConstraints(
					updateConstraints(
						constraints,
						variable,
						Constraints[constraintKey as keyof typeof Constraints],
					),
				)
				setConstraintOption('')
				closeDialogConfirm()
			},
			[
				constraints,
				setConstraintOption,
				variable,
				setConstraints,
				closeDialogConfirm,
			],
		)

		const onChange = useCallback(
			(
				e?: React.FormEvent<HTMLElement | HTMLInputElement>,
				option?: IChoiceGroupOption,
			) => {
				if (
					constraints.manualRelationships?.find(r =>
						involvesVariable(r, variable),
					)
				) {
					setConstraintOption(option?.key as string)
					return toggleDialogConfirm()
				}
				onUpdateConstraints(option?.key)
			},
			[
				onUpdateConstraints,
				toggleDialogConfirm,
				constraints,
				setConstraintOption,
				variable,
			],
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

		const createRenderOptionTooltip = (
			tooltipText: string,
		): IRenderFunction<IChoiceGroupOptionProps> =>
			function ToolTipChoice(
				option?: IChoiceGroupOptionProps,
				defaultRenderLabel?: (
					props: IChoiceGroupOptionProps,
				) => JSX.Element | null,
			): JSX.Element {
				if (!option || !defaultRenderLabel) {
					return <></>
				}

				const originalField = defaultRenderLabel(option)
				if (!originalField) {
					return <></>
				}

				return <TooltipHost content={tooltipText}>{originalField}</TooltipHost>
			}

		// Styles make the buttons grow with the width of the side panel (by default they are fixed size)
		const constraintChooserStyles = {
			root: { flex: 1 },
			choiceFieldWrapper: { flex: 1 },
			innerField: { padding: 0 },
		}
		const constraintChooserOptions: IChoiceGroupOption[] = [
			{
				key: Constraints.Cause,
				text: 'Cause',
				iconProps: { iconName: 'AlignHorizontalLeft' },
				styles: constraintChooserStyles,
				onRenderField: createRenderOptionTooltip(
					"This variable shouldn't have any parents",
				),
			} as IChoiceGroupOption,
			{
				key: Constraints.None,
				text: 'None',
				iconProps: { iconName: 'AlignHorizontalCenter' },
				styles: constraintChooserStyles,
			},
			{
				key: Constraints.Effect,
				text: 'Effect',
				iconProps: { iconName: 'AlignHorizontalRight' },
				styles: constraintChooserStyles,
				onRenderField: createRenderOptionTooltip(
					"This variable shouldn't have any children",
				),
			} as IChoiceGroupOption,
		]

		return (
			<Container>
				<DialogConfirm
					onConfirm={() => onUpdateConstraints(constraintOption)}
					toggle={toggleDialogConfirm}
					show={showDialogConfirm}
					title="Are you sure you want to proceed?"
					subText="Setting this constraint will remove any manual edges you pinned or flipped for this variable"
				></DialogConfirm>
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
				{isInModel && (
					<>
						<Divider>Constraint</Divider>
						<ChoiceGroup
							selectedKey={getConstraintType(constraints, variable)}
							onChange={onChange}
							options={constraintChooserOptions}
						/>
					</>
				)}
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
