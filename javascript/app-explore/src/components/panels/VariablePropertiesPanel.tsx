/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
import { memo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

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
	CausalGraphState,
	DatasetState,
	InModelCausalVariablesState,
} from '../../state/index.js'
import { Chart } from '../charts/Chart.js'
import { Divider } from '../controls/Divider.js'
import { VariableNaturePicker } from '../controls/VariableNaturePicker.js'
import { VariableCorrelationsList } from '../lists/CorrelationList.js'
import {
	add_remove_button_styles,
	panel_stack_tokens,
} from './VariablePropertiesPanel.constants.js'
import type { VariablePropertiesPanelProps } from './VariablePropertiesPanel.types.js'

export const VariablePropertiesPanel: React.FC<VariablePropertiesPanelProps> =
	memo(function VariablePropertiesPanel({ variable }) {
		const dataset = useRecoilValue(DatasetState)
		const causalGraph = useRecoilValue(CausalGraphState)
		const [inModelVariables, setInModelVariables] = useRecoilState(
			InModelCausalVariablesState,
		)

		const isInModel = Graph.includesVariable(causalGraph, variable)
		const [constraints, setConstraints] = useRecoilState(
			CausalGraphConstraintsState,
		)

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
			<>
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
				<Divider>Correlations</Divider>
				<VariableCorrelationsList variable={variable} />
			</>
		)
	})
