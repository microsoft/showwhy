/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'
import {
	Checkbox,
	ChoiceGroup,
	Position,
	SpinButton,
	TextField,
} from '@fluentui/react'
import { memo } from 'react'

import type {
	DECIAlgorithmParams,
	DECIModelOptions,
} from '../domain/Algorithms/DECI.js'
import {
	advancedModelBooleanOptions,
	advancedModelModeAdjacencyChoiceOptions,
	advancedModelNumberListOptions,
	advancedModelSpinningOptions,
	advancedModelVarModeChoiceOptions,
	BASE_DISTRIBUTION_TYPE,
	baseDistributionTypeChoiceOptions,
	CATE_RFF_LENGTHSCALE,
	MODE_ADJACENCY,
	VAR_DIST_A_MODE,
} from './DeciModelParams.constants.js'
import {
	Container,
	ContainerAdvancedCheckbox,
	ContainerAdvancedGrid,
} from './DeciParams.styles.js'
import type { onChangeBooleanFn, onChangeStringFn } from './DeciParams.types.js'

interface DeciModelParamsProps {
	values: DECIAlgorithmParams
	onChangeNumber: onChangeStringFn
	onChangeBoolean: onChangeBooleanFn
	onChangeChoiceGroup: onChangeStringFn
	onChangeNumberList: onChangeStringFn
	onChangeCate: (val?: string | undefined) => void
}
export const DeciModelParams: React.FC<DeciModelParamsProps> = memo(
	function DeciModelParams({
		values,
		onChangeNumber,
		onChangeBoolean,
		onChangeChoiceGroup,
		onChangeNumberList,
		onChangeCate,
	}) {
		return (
			<Container>
				<ContainerAdvancedGrid>
					{advancedModelNumberListOptions.map(x => (
						<TextField
							label={x.label}
							key={x.name}
							onChange={(_, val?: string) =>
								onChangeNumberList('model_options', val, x.name)
							}
							value={
								(
									values.model_options &&
									(values.model_options[
										x.name as keyof DECIModelOptions
									] as number[])
								)?.join(',') || x.defaultValue
							}
						/>
					))}
					<TextField
						label="Cate rff lengthscale"
						onChange={(_, val?: string) => onChangeCate(val)}
						value={
							values?.model_options?.cate_rff_lengthscale?.toString() ||
							CATE_RFF_LENGTHSCALE.toString()
						}
					/>
				</ContainerAdvancedGrid>

				<ContainerAdvancedGrid>
					{advancedModelSpinningOptions.map(x => (
						<SpinButton
							key={x.inputProps?.name}
							label={x.label}
							labelPosition={Position.top}
							onChange={(_, val?: string) =>
								onChangeNumber('model_options', val, x.inputProps?.name)
							}
							value={
								(values.model_options &&
									values.model_options[
										x.inputProps?.name as keyof DECIModelOptions
									]?.toString()) ||
								x.defaultValue
							}
							min={0}
							step={x.step}
							incrementButtonAriaLabel="Increase value by 1"
							decrementButtonAriaLabel="Decrease value by 1"
						/>
					))}
				</ContainerAdvancedGrid>

				<ContainerAdvancedCheckbox>
					{advancedModelBooleanOptions.map(x => (
						<Checkbox
							key={x.name}
							label={x.label}
							checked={
								(values?.model_options?.[x.name as keyof DECIModelOptions] ??
									x.checked) as boolean
							}
							onChange={(_, val?: boolean) =>
								onChangeBoolean('model_options', val, x.name)
							}
						/>
					))}
				</ContainerAdvancedCheckbox>

				<ChoiceGroup
					selectedKey={
						values.model_options?.base_distribution_type ||
						BASE_DISTRIBUTION_TYPE
					}
					options={baseDistributionTypeChoiceOptions}
					onChange={(_, opt?: IChoiceGroupOption) =>
						onChangeChoiceGroup(
							'model_options',
							opt?.key,
							'base_distribution_type',
						)
					}
					label="Base distribution type"
				/>
				<ChoiceGroup
					selectedKey={values.model_options?.mode_adjacency || MODE_ADJACENCY}
					options={advancedModelModeAdjacencyChoiceOptions}
					onChange={(_, opt?: IChoiceGroupOption) =>
						onChangeChoiceGroup('model_options', opt?.key, 'mode_adjacency')
					}
					label="Mode adjacency"
				/>
				<ChoiceGroup
					selectedKey={values.model_options?.var_dist_A_mode || VAR_DIST_A_MODE}
					options={advancedModelVarModeChoiceOptions}
					onChange={(_, opt?: IChoiceGroupOption) =>
						onChangeChoiceGroup('model_options', opt?.key, 'var_dist_A_mode')
					}
					label="Var dist A mode"
				/>
			</Container>
		)
	},
)
