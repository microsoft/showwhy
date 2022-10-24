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
	AnnealEntropy,
	ModeAdjacency,
	VarDistAMode,
} from '../domain/Algorithms/DECI.js'

/** Training default options  */
const LEARNING_RATE_DEFAULT = 3e-2
const BATCH_SIZE = 512
const RHO = 10.0
const SAFETY_RHO = 1e13
const ALPHA = 0.0
const SAFETY_ALPHA = 1e13
const TOL_DAG = 1e-3
const PROGRESS_RATE = 0.25
const MAX_P_TRAIN_DROUPOUT = 0.25
const RECONSTRUCTION_LOSS_FACTOR = 1.0
const STARDARDIZE_DATA_MEAN = false
const STARDARDIZE_DATA_STD = false

export const ANNEAL_ENTROPY = AnnealEntropy.Noanneal

/** Model default  options */
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

export const VAR_DIST_A_MODE = VarDistAMode.Three
export const MODE_ADJACENCY = ModeAdjacency.Learn

export const CATE_RFF_LENGTHSCALE = 1

export const defaultTrainingSpinningOptions = [
	{
		label: 'Max steps auglag',
		inputProps: { name: 'max_steps_auglag' },
		step: 0.1,
		min: 10,
		max: 100,
	},
	{
		label: 'Max auglag inner epochs',
		inputProps: { name: 'max_auglag_inner_epochs' },
		step: 100,
		min: 100,
		max: 2000,
	},
] as ISpinButtonProps[]

export const advancedTrainingAnnealChoiceOptions: IChoiceGroupOption[] = [
	{ key: AnnealEntropy.Linear, text: upperFirst(AnnealEntropy.Linear) },
	{ key: AnnealEntropy.Noanneal, text: upperFirst(AnnealEntropy.Noanneal) },
]

export const advancedTrainingSpinningOptions = [
	{
		label: 'Learning rate',
		defaultValue: LEARNING_RATE_DEFAULT.toString(),
		inputProps: { name: 'learning_rate' },
		step: 0.1,
	},
	{
		label: 'Max p train dropout',
		defaultValue: MAX_P_TRAIN_DROUPOUT,
		inputProps: { name: 'max_p_train_dropout' },
		step: 0.1,
	},
	{
		label: 'Rho',
		defaultValue: RHO,
		inputProps: { name: 'rho' },
		step: 0.1,
	},
	{
		label: 'Safety rho',
		defaultValue: SAFETY_RHO,
		inputProps: { name: 'safety_rho' },
		step: 0.1,
	},
	{
		label: 'Alpha',
		defaultValue: ALPHA,
		inputProps: { name: 'alpha' },
		step: 0.1,
	},
	{
		label: 'Safety alpha',
		defaultValue: SAFETY_ALPHA,
		inputProps: { name: 'safety_alpha' },
		step: 0.1,
	},
	{
		label: 'Tol dag',
		defaultValue: TOL_DAG,
		inputProps: { name: 'tol_dag' },
		step: 0.1,
	},
	{
		label: 'Progress rate',
		defaultValue: PROGRESS_RATE,
		inputProps: { name: 'progress_rate' },
		step: 0.1,
	},
	{
		label: 'Reconstruction loss factor',
		defaultValue: RECONSTRUCTION_LOSS_FACTOR,
		inputProps: { name: 'reconstruction_loss_factor' },
		step: 0.1,
	},
	{
		label: 'Batch size',
		defaultValue: BATCH_SIZE,
		inputProps: { name: 'batch_size' },
		step: 1,
	},
] as ISpinButtonProps[]

export const advancedTrainingBooleanOptions = [
	{
		label: 'Stardardize data mean',
		checked: STARDARDIZE_DATA_MEAN,
		name: 'stardardize_data_mean',
	},
	{
		label: 'Stardardize data std',
		checked: STARDARDIZE_DATA_STD,
		name: 'stardardize_data_std',
	},
] as ICheckboxProps[]

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
