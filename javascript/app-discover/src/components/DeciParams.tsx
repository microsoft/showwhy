/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'
import {
	Checkbox,
	ChoiceGroup,
	Pivot,
	PivotItem,
	Position,
	SpinButton,
	TextField,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { isArray } from 'lodash'
import { memo, useCallback } from 'react'
import { useRecoilState } from 'recoil'

import type {
	DECIModelOptions,
	DECIParams,
	DECITrainingOptions,
} from '../domain/Algorithms/DECI.js'
import { DeciParamsState } from '../state/atoms/algorithms_params.js'
import {
	advancedModelBooleanOptions,
	advancedModelModeAdjacencyChoiceOptions,
	advancedModelNumberListOptions,
	advancedModelSpinningOptions,
	advancedModelVarModeChoiceOptions,
	advancedTrainingAnnealChoiceOptions,
	advancedTrainingBooleanOptions,
	advancedTrainingSpinningOptions,
	ANNEAL_ENTROPY,
	CATE_RFF_LENGTHSCALE,
	defaultTrainingSpinningOptions,
	MODE_ADJACENCY,
	VAR_DIST_A_MODE,
} from './DeciParams.constants.js'
import {
	AdvancedButton,
	Container,
	ContainerAdvancedCheckbox,
	ContainerAdvancedGrid,
} from './DeciParams.styles.js'

export const DeciParams: React.FC = memo(function DeciParams() {
	const [isAdvancedShowing, { toggle: toggleAdvancedOptions }] =
		useBoolean(true)
	const [deciParams, setDeciParams] = useRecoilState(DeciParamsState)

	const onChangeNumberOptions = useCallback(
		(key: keyof DECIParams, val?: string, name?: string) => {
			if (!val || !name) return
			setDeciParams(curr => ({
				...curr,
				[key]: {
					...curr[key],
					[name]: +val,
				},
			}))
		},
		[setDeciParams],
	)

	const onChangeBooleanOptions = useCallback(
		(key: keyof DECIParams, val?: boolean, name?: string) => {
			if (!name) return
			setDeciParams(curr => ({
				...curr,
				[key]: {
					...curr[key],
					[name]: val,
				},
			}))
		},
		[setDeciParams],
	)

	const onChangeChoiceGroupOptions = useCallback(
		(key: keyof DECIParams, val?: string, name?: string) => {
			if (!name || !val) return
			setDeciParams(curr => ({
				...curr,
				[key]: {
					...curr[key],
					[name]: val,
				},
			}))
		},
		[setDeciParams],
	)

	const onChangeNumberListOptions = useCallback(
		(key: keyof DECIParams, val?: string, name?: string) => {
			if (!name || !val) return
			setDeciParams(curr => ({
				...curr,
				[key]: {
					...curr[key],
					[name]: val.replaceAll(' ', '').split(','),
				},
			}))
		},
		[setDeciParams],
	)

	const onChangeCate = useCallback(
		(val?: string) => {
			const value =
				val && isArray(val)
					? val?.split(',').map(v => +v)
					: val
					? +val
					: undefined

			setDeciParams(curr => ({
				...curr,
				model_options: {
					...curr.model_options,
					cate_rff_lengthscale: value,
				},
			}))
		},
		[setDeciParams],
	)

	return (
		<Container>
			{defaultTrainingSpinningOptions.map(x => (
				<SpinButton
					label={x.label}
					key={x.inputProps?.name}
					labelPosition={Position.top}
					value={deciParams.training_options[
						x.inputProps?.name as keyof DECITrainingOptions
					]?.toString()}
					onChange={(_, val?: string) =>
						onChangeNumberOptions('training_options', val, x.inputProps?.name)
					}
					min={x.min}
					max={x.max}
					step={x.step}
					incrementButtonAriaLabel="Increase value by 1"
					decrementButtonAriaLabel="Decrease value by 1"
				/>
			))}
			<AdvancedButton
				toggle
				checked={isAdvancedShowing}
				onClick={toggleAdvancedOptions}
			>
				Advanced options
			</AdvancedButton>
			{isAdvancedShowing && (
				<Pivot aria-label="Advanced options">
					<PivotItem headerText="Training">
						<ContainerAdvancedGrid>
							{advancedTrainingSpinningOptions.map(x => (
								<SpinButton
									key={x.inputProps?.name}
									label={x.label}
									labelPosition={Position.top}
									onChange={(_, val?: string) =>
										onChangeNumberOptions(
											'training_options',
											val,
											x.inputProps?.name,
										)
									}
									value={
										deciParams.training_options[
											x.inputProps?.name as keyof DECITrainingOptions
										]?.toString() || x.defaultValue
									}
									min={1}
									step={x.step}
									incrementButtonAriaLabel="Increase value by 1"
									decrementButtonAriaLabel="Decrease value by 1"
								/>
							))}
						</ContainerAdvancedGrid>
						<ContainerAdvancedCheckbox>
							{advancedTrainingBooleanOptions.map(x => (
								<Checkbox
									label={x.label}
									key={x.name}
									checked={
										!!deciParams.training_options[
											x.name as keyof DECITrainingOptions
										] || x.checked
									}
									onChange={(_, val?: boolean) =>
										onChangeBooleanOptions('training_options', val, x.name)
									}
								/>
							))}
						</ContainerAdvancedCheckbox>
						<ChoiceGroup
							selectedKey={
								deciParams.training_options.anneal_entropy || ANNEAL_ENTROPY
							}
							options={advancedTrainingAnnealChoiceOptions}
							onChange={(_, opt?: IChoiceGroupOption) =>
								onChangeChoiceGroupOptions(
									'training_options',
									opt?.key,
									'anneal_entropy',
								)
							}
							label="Anneal entropy"
						/>
					</PivotItem>
					<PivotItem headerText="Model">
						<ContainerAdvancedGrid>
							{advancedModelSpinningOptions.map(x => (
								<SpinButton
									key={x.inputProps?.name}
									label={x.label}
									labelPosition={Position.top}
									onChange={(_, val?: string) =>
										onChangeNumberOptions(
											'model_options',
											val,
											x.inputProps?.name,
										)
									}
									value={
										(deciParams.model_options &&
											deciParams.model_options[
												x.inputProps?.name as keyof DECIModelOptions
											]?.toString()) ||
										x.defaultValue
									}
									min={1}
									step={x.step}
									incrementButtonAriaLabel="Increase value by 1"
									decrementButtonAriaLabel="Decrease value by 1"
								/>
							))}
						</ContainerAdvancedGrid>
						<ContainerAdvancedGrid>
							{advancedModelNumberListOptions.map(x => (
								<TextField
									label={x.label}
									key={x.name}
									onChange={(_, val?: string) =>
										onChangeNumberListOptions('model_options', val, x.name)
									}
									value={
										(
											deciParams.model_options &&
											(deciParams.model_options[
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
									deciParams?.model_options?.cate_rff_lengthscale?.toString() ||
									CATE_RFF_LENGTHSCALE.toString()
								}
							/>
						</ContainerAdvancedGrid>
						<ContainerAdvancedCheckbox>
							{advancedModelBooleanOptions.map(x => (
								<Checkbox
									key={x.name}
									label={x.label}
									checked={
										(deciParams?.model_options &&
											!!deciParams?.model_options[
												x.name as keyof DECIModelOptions
											]) ??
										x.checked
									}
									onChange={(_, val?: boolean) =>
										onChangeBooleanOptions('model_options', val, x.name)
									}
								/>
							))}
						</ContainerAdvancedCheckbox>

						<ChoiceGroup
							selectedKey={
								deciParams.model_options?.mode_adjacency || MODE_ADJACENCY
							}
							options={advancedModelModeAdjacencyChoiceOptions}
							onChange={(_, opt?: IChoiceGroupOption) =>
								onChangeChoiceGroupOptions(
									'model_options',
									opt?.key,
									'mode_adjacency',
								)
							}
							label="Mode adjacency"
						/>
						<ChoiceGroup
							selectedKey={
								deciParams.model_options?.var_dist_A_mode || VAR_DIST_A_MODE
							}
							options={advancedModelVarModeChoiceOptions}
							onChange={(_, opt?: IChoiceGroupOption) =>
								onChangeChoiceGroupOptions(
									'model_options',
									opt?.key,
									'var_dist_A_mode',
								)
							}
							label="Var dist A mode"
						/>
					</PivotItem>
				</Pivot>
			)}
		</Container>
	)
})
