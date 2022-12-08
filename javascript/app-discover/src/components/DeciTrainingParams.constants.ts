/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ICheckboxProps,
	IChoiceGroupOption,
	ISpinButtonProps,
} from '@fluentui/react'
import { upperFirst } from 'lodash'

import { AnnealEntropy } from '../domain/Algorithms/DECI.js'

const LEARNING_RATE_DEFAULT = 1e-3
const BATCH_SIZE = 256
const RHO = 1.0
const SAFETY_RHO = 1e13
const ALPHA = 0.0
const SAFETY_ALPHA = 1e13
const TOL_DAG = 1e-3
const PROGRESS_RATE = 0.25
const MAX_P_TRAIN_DROUPOUT = 0.25
const RECONSTRUCTION_LOSS_FACTOR = 1.0
const STANDARDIZE_DATA_MEAN = false
const STANDARDIZE_DATA_STD = false

export const ANNEAL_ENTROPY = AnnealEntropy.Noanneal

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
		label: 'Standardize data mean',
		checked: STANDARDIZE_DATA_MEAN,
		name: 'standardize_data_mean',
	},
	{
		label: 'Standardize data std',
		checked: STANDARDIZE_DATA_STD,
		name: 'standardize_data_std',
	},
] as ICheckboxProps[]
