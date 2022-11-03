/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ICheckboxProps,
	IChoiceGroupOption,
	ISpinButtonProps,
	ITextFieldProps,
} from '@fluentui/react'
import upperFirst from 'lodash-es/upperFirst.js'

import {
	BaseDistributionType,
	ModeAdjacency,
	VarDistAMode,
} from '../domain/Algorithms/DECI.js'

const SPLINE_BINS = 16
const LAMBDA_DAG = 100.0
const LAMBDA_SPARSE = 5.0
const TAU_GUMBEL = 1.0
const CATE_RFF_N_FEATURES = 3000
const IMPUTER_LAYER_SIZES: number[] = []
const ENCODER_LAYER_SIZES = [32, 32]
const DECODER_LAYER_SIZES = [32, 32]
const IMPUTATION = false
const NORM_LAYERS = false
const RES_CONNECTION = true

export const BASE_DISTRIBUTION_TYPE = BaseDistributionType.Gaussian
export const VAR_DIST_A_MODE = VarDistAMode.Three
export const MODE_ADJACENCY = ModeAdjacency.Learn

export const CATE_RFF_LENGTHSCALE = 1

export const advancedModelSpinningOptions = [
	{
		label: 'Lambda dag',
		defaultValue: LAMBDA_DAG.toString(),
		inputProps: { name: 'lambda_dag' },
		step: 0.1,
	},
	{
		label: 'Lambda sparse',
		defaultValue: LAMBDA_SPARSE.toString(),
		inputProps: { name: 'lambda_sparse' },
		step: 0.1,
	},
	{
		label: 'Tau gumbel',
		defaultValue: TAU_GUMBEL.toString(),
		inputProps: { name: 'tau_gumbel' },
		step: 0.1,
	},
	{
		label: 'Cate rff n features',
		defaultValue: CATE_RFF_N_FEATURES.toString(),
		inputProps: { name: 'cate_rff_n_features' },
		step: 1,
	},
	{
		label: 'Spline bins',
		defaultValue: SPLINE_BINS.toString(),
		inputProps: { name: 'spline_bins' },
		step: 1,
	},
] as ISpinButtonProps[]

export const advancedModelBooleanOptions = [
	{
		label: 'Imputation',
		checked: IMPUTATION,
		name: 'imputation',
	},
	{
		label: 'Norm layers',
		checked: NORM_LAYERS,
		name: 'norm_layers',
	},
	{
		label: 'Res connection',
		checked: RES_CONNECTION,
		name: 'res_connection',
	},
] as ICheckboxProps[]

export const advancedModelNumberListOptions = [
	{
		label: 'Imputer layer sizes',
		defaultValue: IMPUTER_LAYER_SIZES.join(','),
		name: 'imputer_layer_sizes',
	},
	{
		label: 'Encoder layer sizes',
		defaultValue: ENCODER_LAYER_SIZES.join(','),
		name: 'encoder_layer_sizes',
	},
	{
		label: 'Decoder layer sizes',
		defaultValue: DECODER_LAYER_SIZES.join(','),
		name: 'decoder_layer_sizes',
	},
] as ITextFieldProps[]

export const baseDistributionTypeChoiceOptions: IChoiceGroupOption[] = [
	{
		key: BaseDistributionType.Gaussian,
		text: upperFirst(BaseDistributionType.Gaussian),
	},
	{
		key: BaseDistributionType.Spline,
		text: upperFirst(BaseDistributionType.Spline),
	},
]

export const advancedModelVarModeChoiceOptions: IChoiceGroupOption[] = [
	{ key: VarDistAMode.Enco, text: upperFirst(VarDistAMode.Enco) },
	{ key: VarDistAMode.Simple, text: upperFirst(VarDistAMode.Simple) },
	{ key: VarDistAMode.Three, text: upperFirst(VarDistAMode.Three) },
	{ key: VarDistAMode.True, text: upperFirst(VarDistAMode.True) },
]

export const advancedModelModeAdjacencyChoiceOptions: IChoiceGroupOption[] = [
	{ key: ModeAdjacency.Learn, text: upperFirst(ModeAdjacency.Learn) },
	{ key: ModeAdjacency.Lower, text: upperFirst(ModeAdjacency.Lower) },
	{ key: ModeAdjacency.Upper, text: upperFirst(ModeAdjacency.Upper) },
]
